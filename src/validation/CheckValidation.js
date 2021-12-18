const { validationResult, check } = require('express-validator')


// validate  the result 
const resultsValidator =  (req) => {
  const messages = []
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array()
    for (const i of errors) {
      messages.push(i.msg)
    }
  }
  return messages
}

// Register validation
const registerValidator = () => {
  return [ 
    check('username').notEmpty()
      .withMessage('Username is required!')
      .isLength({ min: 6 })
      .withMessage('Username container at least 6 ')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\d&]/) 
      .withMessage('Username contain At least one uppercase.At least one lower case & one number')
      .trim().escape(),
    check('password')
      .notEmpty().withMessage('password is required').isLength({ min: 6 })
      .withMessage('password must be greater 5 characters')
  ]
}

//login Validation
const loginValidator = () => {
    return [
      check('username').notEmpty().withMessage('username or email is required'),
      check('password').notEmpty().withMessage('password is required')
    ]
  }
  //Forgot password validation
  const sendOtp = () => {
    return [
      check('username').notEmpty().withMessage('username is required')
    ]
  }

  //Avatar validation
  const AvatarValidation = () => {
    return [
      check('avatar').notEmpty().withMessage('Please upload avatar')
    ]
  }

  //Change password validation
  const changePasswordValidator = () => {
    return [
      check('password').notEmpty().withMessage('Old password is required'),
      check('newPassword')
      .trim()
      .notEmpty()
      .withMessage('Password is required!')
      .isLength({min:6, max:16}) 
      .withMessage('Password must be between 6 to 16 characters') 
    ]
  }
  //Otp verify validation
  const forgotPasswordValidator = () => {
    return [
      check('username').notEmpty().trim().withMessage('Username is required'),
      check('otp').notEmpty().withMessage('Otp is required'),
      check('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required!')
      .isLength({min:6, max:16}) 
      .withMessage('Password must be between 6 to 16 characters') 
    ]
  }
  module.exports = {
    loginValidator,
    registerValidator,
    resultsValidator,
    sendOtp,
    AvatarValidation,
    changePasswordValidator,
    forgotPasswordValidator
  }