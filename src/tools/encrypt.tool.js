
const bcryptjs = require('bcryptjs')

const compare_ = (password_encrypt, password_textplain) => {
  return bcryptjs.compare(password_textplain, password_encrypt)
}

const encrypt_ = async (data) => {
  return await bcryptjs.hash(data, 13)
}

module.exports = {
  encrypt_,
  compare_
}