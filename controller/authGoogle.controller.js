const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET;
const handleCallback = async (req, res) => {
  if (req.user) {
    const Role = "User";
    // const { name, email, picture } = req.user;
    const profile = req.user;
    const { name, email, picture } = profile._json;

    const data = { UserName: name, Img: picture, Email: email, Role: Role };

    const findOrCreateUser = async () => {
      const findUser = await userModel.find({ Email: email });
      if (findUser == null) {
        const findUser = await userModel.create(data);
        console.log(findUser);
      } else {
        console.log("tk đã tồn tại");
      }
    };
    findOrCreateUser();
    // const createUser = await userModel.create(data);

    res.json(data);
    // res.redirect("/home");
  } else {
    console.log("Xác thực không thành công");
    res.redirect("/login");
  }
};

module.exports = handleCallback;
