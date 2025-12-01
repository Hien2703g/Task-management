module.exports = (query, objectPagitation, countRecords) => {
  if (query.page) {
    objectPagitation.currentPage = parseInt(query.page);
  }
  if (query.limit) {
    objectPagitation.limitItem = parseInt(query.limit);
  }

  objectPagitation.skip =
    (objectPagitation.currentPage - 1) * objectPagitation.limitItem;
  // console.log(objectPagitation.currentPage);
  const totalPage = Math.ceil(countRecords / objectPagitation.limitItem);
  // console.log(totalPage);

  objectPagitation.totalPage = totalPage;

  return objectPagitation;
};
