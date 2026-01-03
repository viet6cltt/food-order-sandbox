const { hashPassword } = require('./src/utils/authHelper.js');

(async () => {
  const password = '123456';
  const hashed = await hashPassword(password);
  console.log('Password: ', password);
  console.log('Hashed: ', hashed );
})();