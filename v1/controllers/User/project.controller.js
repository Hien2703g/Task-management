const Project = require("../../models/project.model");
const Comment = require("../../models/comment.model");
const PagitationHelper = require("../../helpers/pagitation");
const SearchHelper = require("../../helpers/search");
const User = require("../../models/user.model");

//[GET]/api/v1/projects
module.exports.index = async (req, res) => {
  const find = {
    $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  if (req.query.tag) {
    find.tag = req.query.tag;
  }
  //Search
  let objectSearch = SearchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  //end search

  //Pagination
  let initPagination = {
    currentPage: 1,
    limitItem: 2,
  };
  const countProjects = await Project.countDocuments(find);
  const objectPagination = PagitationHelper(
    req.query,
    initPagination,
    countProjects
  );
  //End Pagination
  //sort
  // console.log(req.query);
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  //end sort
  const projects = await Project.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.json(projects);
};

//[GET]/api/v1/projects/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const findcomment = {
      $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
      deleted: false,
      project_id: id,
    };
    const comment = await Comment.find(findcomment);
    // console.log(comment);
    const project = await Project.findOne({
      _id: id,
      deleted: false,
    });
    res.json({
      code: 200,
      message: "success",
      data: project,
      comment: comment,
    });
  } catch (error) {
    res.json("Khong tim thay");
  }
};

//[POST]/api/v1/projects/create
module.exports.create = async (req, res) => {
  try {
    // console.log(req.user.id);
    req.body.createdBy = req.user.id;
    // console.log(req.body.projectParentId);
    const ProjectParent = await Project.findOne({
      $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
      _id: req.body.projectParentId,
      deleted: false,
    });
    // console.log(ProjectParent);
    if (ProjectParent) {
      req.body.manager = ProjectParent.manager;
      // console.log(req.body);
      const project = new Project(req.body);
      const data = await project.save();
      res.json({
        code: 200,
        message: "success",
        data: data,
      });
    } else {
      res.json({
        message: "Khoong thấy ProjectParent",
      });
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};
//[GET]/api/v3/projects/add-member/:id
module.exports.ListUser = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findOne({
      _id: id,
      deleted: false,
    });

    if (!project) {
      return res.status(404).json({
        code: 404,
        message: "Project không tồn tại",
      });
    }

    let users;

    if (project.projectParentId) {
      const projectParent = await Project.findOne({
        _id: project.projectParentId,
        deleted: false,
      });

      if (projectParent) {
        const userIds =
          Array.isArray(projectParent.listUser) &&
          projectParent.listUser.length > 0
            ? projectParent.listUser
            : [projectParent.createdBy];

        users = await User.find({
          _id: { $in: userIds },
          deleted: false,
        }).select("-password -token");
      } else {
        users = await User.find({ deleted: false }).select("-password -token");
      }
    } else {
      users = await User.find({ deleted: false }).select("-password -token");
    }

    return res.json({
      code: 200,
      message: "Lấy danh sách user thành công",
      data: users,
    });
  } catch (error) {
    console.error("ListUser error:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
//[PATCH]/api/v3/projects/add-member/:id
module.exports.addMember = async (req, res) => {
  const projectId = req.params.id;
  const { ListUser } = req.body;

  try {
    // Kiểm tra ListUser hợp lệ
    if (!Array.isArray(ListUser) || ListUser.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "ListUser phải là array và không được rỗng",
      });
    }

    // Tìm project
    const project = await Project.findOne({ _id: projectId, deleted: false });
    if (!project) {
      return res.status(404).json({
        code: 404,
        message: "Project không tồn tại",
      });
    }

    // Lấy danh sách user hợp lệ
    const users = await User.find({
      _id: { $in: ListUser },
      deleted: false,
    });

    // Nếu thiếu user nào => báo lỗi
    if (users.length !== ListUser.length) {
      return res.status(404).json({
        code: 404,
        message: "Một hoặc nhiều User trong danh sách không tồn tại",
      });
    }

    // Lọc ra user chưa có trong project
    const usersToAdd = ListUser.filter(
      (userId) => !project.listUser.includes(userId)
    );

    if (usersToAdd.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Tất cả User trong danh sách đã có trong project",
      });
    }

    // Thêm user mới
    project.listUser.push(...usersToAdd);
    await project.save();

    return res.json({
      code: 200,
      message: "Thêm thành viên thành công",
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
//[PATCH]/api/v1/projects/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const data1 = await Project.findOne({
      _id: id,
      deleted: false,
    });
    const createdUser = await User.findOne({
      _id: data1.createdBy,
    });
    // console.log(createdUser.id);
    // console.log(req.user.id);
    if (createdUser.id === req.user.id) {
      // console.log("OK");
      await Project.updateOne({ _id: id }, req.body);
      const data = await Project.findOne({
        _id: id,
        deleted: false,
      });
      res.json({
        code: 200,
        message: "success, cập nhật thành công",
        data: data,
      });
    } else {
      res.json({
        code: 200,
        message: "Ban khong phai nguoi tao du an, nen khong the sửa",
      });
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[PATCH] /api/v1/projects/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const data = await Project.findOne({
      _id: id,
      deleted: false,
    });
    await Project.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    console.log(req.body);

    res.json({
      code: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    console.log(ids);
    console.log(key);
    console.log(value);
    switch (key) {
      case "status":
        await Project.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "success",
        });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: req.user.id,
          }
        );
        res.json({
          code: 200,
          message: "success",
        });
        break;
      default:
        res.json({
          code: 404,
          message: "dismiss",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[PATCH]/api/v1/projects/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Project.findOne({
      _id: id,
    });
    // const data1 = await Project.findOne({
    //   _id: id,
    //   deleted: false,
    // });
    const createdUser = await User.findOne({
      _id: data.createdBy,
    });
    // console.log(createdUser.id);
    // console.log(req.user.id);
    if (createdUser.id === req.user.id) {
      await Project.updateOne(
        { _id: id },
        {
          deleted: true,
          deletedAt: new Date(),
          deletedBy: req.user.id,
        }
      );
      res.json({
        code: 200,
        message: "success",
        data: data,
      });
    } else {
      res.json({
        message: "Ban khong phai nguoi tao du an, nen khong the xoa",
      });
    }
    // console.log(data);
    // console.log(req.user.id);
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[PATCH]/api/v1/tasks/priority/:id
module.exports.changePriority = async (req, res) => {
  try {
    const id = req.params.id;
    const priority = req.body.priority;
    await Project.updateOne(
      {
        _id: id,
      },
      {
        priority: priority,
      }
    );
    console.log(req.body);

    res.json({
      code: 200,
      message: "success",
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[POST]/api/v1/projects/comment/:id
module.exports.comment = async (req, res) => {
  try {
    const countComments = (await Comment.countDocuments()) + 1;
    // console.log("req.params.id:", req.params.id);
    // console.log("req.user.id:", req.user?.id);
    // console.log("req.body:", req.body.comment);
    const newComment = new Comment({
      project_id: req.params.id,
      user_id: req.user.id,
      userName: req.user.fullName,
      comment: req.body.comment,
      position: countComments,
    });
    const data = await newComment.save();
    console.log(newComment);
    if (newComment) {
      res.json({
        code: 200,
        message: "success",
        data: data,
      });
    } else {
      res.json({
        code: 200,
        message: "Khong lay ra duoc du lieu",
      });
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[PATCH]/api/v1/projects/comment/edit/:id
module.exports.editComment = async (req, res) => {
  try {
    // console.log(req.params.id);
    const id = req.params.id;
    const comment = await Comment.findOne({
      _id: id,
      deleted: false,
      user_id: req.user.id,
    });
    if (comment) {
      await Comment.updateOne(
        {
          _id: id,
        },
        {
          comment: req.body.comment,
        }
      );
      const data = await Comment.findOne({
        _id: id,
        deleted: false,
      });
      res.json({
        code: 200,
        message: "đã chỉnh sửa comment",
        data: data,
      });
    } else {
      res.json({
        code: 400,
        message: "Ban khong duoc sua comment cua nguoi khac",
      });
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};

//[PATCH]/api/v1/projects/comment/delete/:id
module.exports.deleteComment = async (req, res) => {
  try {
    // console.log(req.params.id);
    const id = req.params.id;
    const comment = await Comment.findOne({
      _id: id,
      deleted: false,
      user_id: req.user.id,
    });
    if (comment) {
      await Comment.updateOne(
        {
          _id: id,
        },
        {
          deleted: true,
        }
      );
      const data = await Comment.findOne({
        _id: id,
        deleted: false,
      });
      res.json({
        code: 200,
        message: "đã xoá comment",
        data: data,
      });
    } else {
      res.json({
        code: 400,
        message: "Ban khong duoc xoá comment cua nguoi khac",
      });
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "dismiss",
    });
  }
};
