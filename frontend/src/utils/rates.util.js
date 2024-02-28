const deleteDuplicates = (collection) => {
  if (collection.length !== 0) {
    return Array.from(
      new Set(
        collection.map(
          (pairUnit) => pairUnit.currency.asset + pairUnit.paymentSystem.name
        )
      )
    ).map((signature) => {
      return collection.find(
        (pairUnitItem) =>
          pairUnitItem.currency.asset + pairUnitItem.paymentSystem.name === signature
      );
    });
  }
  return {};
};

export { deleteDuplicates };
