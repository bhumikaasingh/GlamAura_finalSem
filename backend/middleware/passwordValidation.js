const passwordValidator = require("password-validator")

const schema = new passwordValidator()

schema
  .is()
  .min(12) // Minimum length 12
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]) // Blacklist these values

const validatePassword = (password) => {
  return schema.validate(password)
}

module.exports = validatePassword

