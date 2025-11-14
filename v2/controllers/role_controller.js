const { query, application } = require("express");
const Role = require("../models/role.model");

//[GET]/admin/roles
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const data = await Role.find(find);
    res.json({
      code: 200,
      message: "Lay danh sach nhom quyen thanh cong",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[POST]/amdin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const data = new Role(req.body);
    await data.save();
    res.json({
      code: "200",
      message: "Tạo mới thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  // console.log(req.body);
  // console.log("OK");
  const id = req.params.id;
  try {
    // console.log(id);
    await Role.updateOne(
      {
        _id: id,
      },
      req.body
    );
    const data = await Role.findOne({
      deleted: "false",
      _id: id,
    });

    res.json({
      code: "200",
      message: "cap nhat thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Role.findOne({
      deleted: "false",
      _id: id,
    });

    res.json({
      code: "200",
      message: "cap nhat thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

////PERMISSION
//[PATCH] admin/roles/permission
module.exports.permissionsPatch = async (req, res) => {
  try {
    console.log(req.body.Permissions);
    // const permissions = JSON.parse(req.body.Permissions);
    const permissions = req.body.Permissions;
    // console.log(permission);
    for (const item of permissions) {
      // console.log(item.id);
      // const role = await Role.find({
      //   deleted: false,
      //   _id: item.id,
      // });
      // console.log(role);
      await Role.updateOne(
        { _id: item.id },
        {
          permissions: item.permissions,
        }
      );
    }
    const data = await Role.find({
      deleted: false,
    });
    res.json({
      code: 200,
      message: "đã cập nhật giấy phép",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};
