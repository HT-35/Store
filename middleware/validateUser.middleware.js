const Joi = require("joi");

const { validate, ValidationError } = require("express-validation");
// const Joi = require('joi');
const validateUser = (req, res, next) => {
  const { UserName, Password, Address, NumberPhone, Email, Role } = req.body;

  console.log({ UserName, Password, Address, NumberPhone, Email, Role });

  const validateUser = Joi.object({
    UserName: Joi.string().required(),
    Password: Joi.string().required(),
    Address: Joi.string().required(),
    NumberPhone: Joi.string()
      .regex(/^0\d{9}$/)
      .required(),
    Email: Joi.string().email(),
    Role: Joi.string().valid("Admin", "User").required(),
  });

  const result = validateUser.validate({
    UserName,
    Password,
    Address,
    NumberPhone,
    Email,
    Role,
  });

  // const ChenkValidate = (err, req, res, next) => {
  //   if (err instanceof ValidationError) {
  //     return res.status(err.statusCode).json(err);
  //   }

  if (result.error) {
    // console.log("Dữ liệu không hợp lệ:", result.error.details[0].message);
    console.log(result.error.details[0].message);
    res.status(400).json({
      status: false,
      data: result.error.details[0].message,
    });
    return;
  } else {
    // console.log("Dữ liệu hợp lệ.");
    next();
    return;
  }
};

module.exports = validateUser;
