const { query, application } = require("express");
const md5 = require("md5");

const Account = require("../models/account.model");

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
      email: email,
      deleted: false,
    });
    // console.log(user);
    if (!user) {
      res.json({
        code: 400,
        message: "Tài khoản không tồn tại!!!",
      });
    }
    if (md5(password) != user.password) {
      res.json({
        code: 400,
        message: "Sai mat khau!!!",
      });
    }
    if (user.deleted != false) {
      res.json({
        code: 400,
        message: "Tai khoan da bi khoa!!!",
      });
    }
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Dang nhap thanh cong",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "Dismiss",
    });
  }
};

//[GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: 200,
    message: "Đã đăng xuất thành công",
  });
};
