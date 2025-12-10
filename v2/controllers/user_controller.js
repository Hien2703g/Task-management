const { query, application } = require("express");
const User = require("../models/user.model");
const Account = require("../models/account.model");
const filterStatusHelper = require("../helpers/filterStatus");
const SearchHelper = require("../helpers/search");
const PagitationHelper = require("../helpers/pagination");
const systemConfig = require("../config/system");
// [GET]/amdin/users
module.exports.index = async (req, res) => {
  try {
    // FilterSatus
    const filterStatus = filterStatusHelper.item(req.query);
    let find = {
      deleted: false,
    };
    if (req.query.status) {
      find.status = req.query.status;
    }
    //End FilterStatus

    // Search
    const objectSearch = SearchHelper(req.query);
    if (objectSearch.regex) {
      find.fullName = objectSearch.regex;
    }
    //End Search

    const countUsers = await User.countDocuments(find);
    //Pagitation
    let objectPagitation = PagitationHelper(
      req.query,
      {
        limitItem: 5,
        currentPage: 1,
      },
      countUsers
    );
    //Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.fullName = "asc";
    }

    //End Sort
    const records = await User.find(find)
      .sort(sort)
      .limit(objectPagitation.limitItem)
      .skip(objectPagitation.skip)
      .select("-password -token");

    for (const record of records) {
      //Lấy ra thông tin người tạo
      // const account = await Account.findOne({
      //   _id: record.createdBy.account_id,
      // });
      // // console.log(user);
      // if (account) {
      //   record.accountFullName = account.fullName;
      // }
      // Lấy thông tin người cập nhật gần nhất
      //Lấy ra thông tin người cập nhật gần nhất
      const updatedBy = record.updatedBy[record.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });

        updatedBy.accountFullName = userUpdated.fullName;
      }
    }
    res.render("pages/user/index.pug", {
      pageTitle: "Danh sách tài khoản người dùng",
      records: records,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagitation: objectPagitation,
    });
    // res.send("Trang tong quan");
  } catch (error) {
    req.flash("error", `Loi users index `);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
};

// [PATCH]/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await User.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};
// [PATCH]/admin/products/change-role/:role/:id
module.exports.changeRole = async (req, res) => {
  try {
    // console.log(req.params);
    const role = req.params.role;
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await User.updateOne(
      { _id: id },
      { role: role, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật quyền thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  } catch (error) {
    req.flash("error", "Cập nhật quyền thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};
// [DELETE] /admin/users/delete;
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    await User.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", `Đã xóa tài khoản người dùng thành công!!!`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Hành động xóa tài khoản người dùng thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};
// [GET] /admin/user/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const user = await User.findOne(find);
    res.render("pages/user/detail", {
      pageTitle: user.title,
      user: user,
    });
  } catch (error) {
    req.flash("error", `Loi `);
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};
