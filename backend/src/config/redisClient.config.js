const { createClient, ReconnectStrategyError } = require('redis');

const isRender = process.env.REDIS_URL && process.env.REDIS_URL.includes('red-');

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    // Nếu Render thì bật TLS, local thì không
    tls: isRender ? true : false,
    rejectUnauthorized: false,
    reconnectStrategy: retries => Math.min(retries * 100, 3000)
  },
});

client.on('error', (err) => console.error('❌ Redis Error:', err));
client.on('connect', () => console.log('🚀 Redis Connected!'));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('❌ Could not connect to Redis:', err);
  }
})();

module.exports = client;