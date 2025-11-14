const md5 = require("md5");
const Account = require("../models/account.model");

const generateHelper = require("../helpers/generate");
//[POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    // console.log(req.body);
    console.log(req.body);
    req.body.password = md5(req.body.password);
    // console.log(req.body);
    const existEmail = await Account.findOne({
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
      const user = new Account({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        token: generateHelper.generateRandomString(30),
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
  } catch (error) {
    res.json({
      code: 404,
      message: "Dismiss",
    });
  }
};

//[PATCH] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });
    console.log(emailExist);
    if (emailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại`,
      });
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      await Account.updateOne(
        {
          _id: id,
        },
        req.body
      );
      res.json({
        code: 200,
        message: "đã cập nhật tài khoản",
      });
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "Dismiss",
    });
  }
};

//[GET] admin/accounts/detail
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const account = await Account.findOne(find).select("-password -token");
    res.json({
      code: 200,
      message: "Lay thong tin nguoi dung thanh cong",
      data: account,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "Dismiss",
    });
  }
};
