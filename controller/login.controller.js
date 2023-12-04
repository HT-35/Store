const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  const { UserName, Password } = req.body;
  const data = req.body;

  // console.log(data);
  const privateKey = process.env.SECRET;

  try {
    const findUser = await userModel.findOne({ UserName });
    if (!findUser) {
      return res.status(400).json({
        status: false,
        data: "User not found",
      });
    }
    // console.log(findUser);

    const storedPassword = findUser.Password;
    const decodedPassword = jwt.verify(storedPassword, privateKey);

    const data = {
      _id: findUser._id,
      UserName: UserName,
      Role: findUser.Role,
    };

    if (Password === decodedPassword.Password) {
      const tokenUser = jwt.sign({ data }, privateKey, {
        expiresIn: "100h",
      });

      return res.status(200).json({
        status: true,
        token: tokenUser,
        data: data,
      });
    } else {
      return res.status(400).json({
        status: false,
        data: "Incorrect Username or Password",
      });
    }
  } catch (error) {
    console.error("Error in loginController: ", error);
    return res.status(500).json({
      status: false,
      data: "An error occurred during login",
    });
  }
};

module.exports = loginController;
