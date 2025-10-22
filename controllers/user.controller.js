const md5 = require("md5");

const generateHelper = require("../helpers/generate");
const sendMailHelper = require("../helpers/send-mail");

const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  console.log(req.body);
  req.body.password = md5(req.body.password);
  // console.log(req.body);
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  // console.log(existEmail);
  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });
    user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Tao tai khoan thanh cong",
      token: token,
    });
  }
};

//[POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Dang nhap khong thanh cong",
    });
    return;
  }
  // console(email);
  // console(password);
  if (md5(password) !== user.password) {
    res.json({
      code: 404,
      message: "sai mat khau",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Dang nhap thanh cong",
    token: token,
  });
};
//[POST]/api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email khong ton tai!!!",
    });
    return;
  }
  //Luu thong tin vao DB
  const otp = generateHelper.generateRandomNumber(8);

  // const timeExpire = 5;

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  console.log(objectForgotPassword);

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Neu ton tai thi gui ma OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `Mã OTP lấy lại mật khẩu là :<b>${otp}</b>. Thời hạn sử dụng là 3 phút. Hế, đại đại nha bà`;

  sendMailHelper.sendMail(email, subject, html);
  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email !!!",
  });

  // res.redirect(`/user/password/otp?email=${email}`);
};
