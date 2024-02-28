const getPageOnRemove = (
  currentPage,
  totalCount,
  itemsPerPage,
  handleChangeFilter
) => {
  let calculatedPage = Math.ceil((totalCount - 1) / itemsPerPage);
  if (currentPage > lastPage) currentPage = lastPage;
  else if (currentPage > calculatedPage) currentPage = calculatedPage;
  if (currentPage < 1) return 1;
  handleChangeFilter("page", currentPage);
  return currentPage;
};

export { getPageOnRemove };
