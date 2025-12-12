const Task = require("../../models/task.model");
const PagitationHelper = require("../../helpers/pagitation");
const SearchHelper = require("../../helpers/search");
const Notification = require("../../models/notification.model");

//[GET]/api/v1/tasks
module.exports.index = async (req, res) => {
  // console.log(res.locals.settingGeneral);
  const find = {
    deleted: false,
    createdBy: req.user.id,
  };
  if (req.query.status) {
    find.status = req.query.status;
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
  const countTasks = await Task.countDocuments(find);
  const objectPagination = PagitationHelper(
    req.query,
    initPagination,
    countTasks
  );
  //End Pagination
  //sort
  // console.log(req.query);
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  //end sort
  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.json(tasks);
};
//[GET]/api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch (error) {
    res.json("Khong tim thay");
  }
};
//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne(
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
    // console.log(ids);
    // console.log(key);
    // console.log(value);
    switch (key) {
      case "status":
        await Task.updateMany(
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

//[POST]/api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    // console.log(req.user.id);
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();
    // console.log(data.id);
    await Notification.create({
      User_id: req.user.id,
      Sender_id: req.user.id,
      title: "Tạo công việc mới",
      message: `Bạn vừa tạo task: ${data.title}`,
      type: "task_created",
      URL: `/tasks/${data._id}`,
    });
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
//[PATCH]/api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    await Notification.create({
      User_id: req.user.id, // người nhận
      Sender_id: req.user.id, // người chỉnh sửa
      title: "Cập nhật Task",
      message: `Task ID ${id} đã được cập nhật.`,
      type: "update_task",
      URL: `/tasks/${id}`,
    });
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
//[PATCH]/api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      }
    );
    await Notification.create({
      User_id: req.user.id, // người nhận
      Sender_id: req.user.id, // người chỉnh sửa
      title: "Xoá Task",
      message: `Task ID ${id} đã bị xoá.`,
      type: "deleted_task",
      URL: `/tasks/${id}`,
    });
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

//[PATCH]/api/v1/tasks/priority/:id
module.exports.changePriority = async (req, res) => {
  try {
    const id = req.params.id;
    const priority = req.body.priority;
    await Task.updateOne(
      {
        _id: id,
      },
      {
        priority: priority,
      }
    );
    // console.log(req.body);

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
