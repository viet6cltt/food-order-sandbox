const multer = require("multer");
const upload = multer({ dest: "tmp/" }); // lưu file tạm

module.exports = upload;
