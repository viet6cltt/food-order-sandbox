const AuthService = require('../services/auth.service');

// [GET] /
async function index(req, res, next) {

}
// [POST] /register
async function register(req, res, next) {
  const { username, password, idToken } = req.body;

  if (!username || !password || !idToken) {
    return res.status(400).json({ error: 'username, password, and idToken are required' });
  }

  const result = await AuthService.registerWithFirebase({ username, password, idToken });
  return res.status(201).json(result);
}

module.exports = { index, register };