module.exports = function checkPassword(password){
  if (password.length < 8) {
    throw new Error('Validation error: password length must be at least 8 characters')
  }
}