export const weightedRating = (array) => {
  // console.log('weightedRating called with: ', array);

  if (array === null || array.length === 0) return 0; 

  const ratings = array.reduce((obj, startCount) => {
    if (!obj[startCount]) {
      obj[startCount] = 0;
    }
      obj[startCount]++;
      return obj;
  }, {});

  let weightedRatingCount = 0;
  for (let rating in ratings) {
    weightedRatingCount += rating * ratings[rating];
  }

  let totalRatingsCount = 0;
  for (let rating in ratings) {
    totalRatingsCount += ratings[rating]
  }

  return Math.ceil(weightedRatingCount/totalRatingsCount);
};
