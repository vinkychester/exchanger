const filterPairUnitsByDirection = (collection, direction) => {
  return collection.filter((item) => direction === item.direction);
};

export { filterPairUnitsByDirection };
