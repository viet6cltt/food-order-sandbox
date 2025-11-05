const providersConfig = require('../config/providers.config');
const authHelper = require('../utils/authHelper');
const crypto = require('crypto');

function buildQuery(params) {
  // ví dụ: params: {client_id: 'abc', scope: 'email profile'} 
  // đầu ra: client_id=abc&scope=email%20profile
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v);
  });

  return p.toString();
}

class OauthService {
  buildAuthUrl(providerKey, returnUrl) {
    const cfg = providersConfig[providerKey];
    if (!cfg || !cfg.clientId || !cfg.callbackUrl) {
      throw new Error(`Provider "${providerKey}" doesn't configured!`);
    }

    const state = authHelper.generateOauthToken({
      provider: providerKey, 
      nonce: crypto.randomBytes(16).toString('hex'), // chuỗi ngâu nhiên để tăng tính độc nhất của yêu cầu
      returnUrl: returnUrl || process.env.APP_URL || 'http://localhost:5173'
    });

    // core params
    const core = {
      client_id: cfg.clientId,
      redirect_uri: cfg.callbackUrl,
      response_type: cfg.responseType || 'code',
      scope: Array.isArray(cfg.scope) ? cfg.scope.join(' ') : cfg.scope,
      state
    };

    const params = { ...(cfg.exams || {}), ...core };
    const query = buildQuery(params);

    console.log('query: ', query);
    console.log('url: ', `${cfg.authUrl}?${query}`);

    return { url: `${cfg.authUrl}?${query}`, state };
  }

  parseAndVerifyState(state) {
    return authHelper.verifyOauthToken(state);
  }
}

module.exports = new OauthService();

