// [GET]/amdin/dashboard
module.exports.index = async (req, res) => {
  res.render("pages/dashboard/index.pug", {
    pageTitle: "Dashboard",
  });
  // res.send("Trang tong quan");
};
