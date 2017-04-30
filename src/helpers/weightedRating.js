export const weightedRating = (array) => {
  const ratings = array.reduce((obj, item) => {
    if (!obj[item]) {
      obj[item] = 0;
    }
      obj[item]++;
      return obj;
  }, {});

  // numninator
  let weightedRatingCount = 0;
  for (let rating in ratings) {
    weightedRatingCount += rating * ratings[rating];
  }

  // denominator
  let totalRatingsCount = 0;
  for (let rating in ratings) {
    totalRatingsCount += ratings[rating]
  }

  return Math.ceil(weightedRatingCount/totalRatingsCount);
};
