const userModel = require("../model/user.model");

const jwt = require("jsonwebtoken");
const createUser = async (req, res) => {
  const privateKey = process.env.SECRET;

  try {
    const { UserName, Password, Address, NumberPhone, Email } = req.body;
    const tokenPassword = jwt.sign({ Password: Password }, privateKey);
    const Role = "User";
    const createUser = await userModel.create({
      UserName,
      Password: tokenPassword,
      Address,
      NumberPhone,
      Email,
      Role,
    });
    console.log(createUser);

    res.status(200).json({
      status: true,
      data: createUser,
    });
  } catch (error) {
    console.log(error);
    if (error.code) {
      res.status(400).json({
        status: false,
        data: `${JSON.stringify(error.keyValue)} đã tồn tại !!`,
      });
      return;
    }
    res.status(400).json({
      status: false,
      data: error,
    });
  }
};

module.exports = { createUser };
