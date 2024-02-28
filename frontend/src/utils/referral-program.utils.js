const getSortReferralUserRelations = (referralUserRelations) => {
  const { collection } = referralUserRelations;

  if (!collection.length) {
    return null;
  }

  let sortedRelations = {};
  collection.map(relation => {
    if (!sortedRelations[relation.level]) {
      sortedRelations[relation.level] = [];
    }
    sortedRelations[relation.level].push(relation.invitedUser);
  });

  return sortedRelations;
};

const hideEmail = (email) => {
  let temp = email.split('@');
  return temp[0].substr(0,2) + "***@" + temp[1];
};

export {
  getSortReferralUserRelations,
  hideEmail
};