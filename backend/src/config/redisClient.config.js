const { createClient } = require('redis');

// Lấy URL từ biến môi trường REDIS_URL trên Render
const redisUrl = process.env.REDIS_URL;

// Kiểm tra giao thức để quyết định bật TLS
// Nếu URL bắt đầu bằng rediss:// thì mới bật TLS
const useTls = redisUrl?.startsWith('rediss://');

const client = createClient({
  url: redisUrl,
  socket: {
    // Chỉ thêm thuộc tính tls nếu cần thiết
    ...(useTls && { tls: true, rejectUnauthorized: false }),
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
  },
});

client.on('error', (err) => console.error('❌ Redis Error:', err));
client.on('connect', () => console.log('🚀 Redis Connected!'));

(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (err) {
    console.error('❌ Could not connect to Redis:', err);
  }
})();

module.exports = client;