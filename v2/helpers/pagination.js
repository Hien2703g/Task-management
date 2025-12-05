module.exports = (query, objectPagitation, countProducts) => {
  if (query.page) {
    objectPagitation.currentPage = parseInt(query.page);
  }

  objectPagitation.skip =
    (objectPagitation.currentPage - 1) * objectPagitation.limitItem;
  // console.log(objectPagitation.currentPage);
  const totalPage = Math.ceil(countProducts / objectPagitation.limitItem);
  // console.log(totalPage);

  objectPagitation.totalPage = totalPage;

  return objectPagitation;
};
