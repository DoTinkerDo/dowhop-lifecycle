'use strict';

function calculateWeightedRating(array) {
  // console.log('weightedRating called with: ', array);

  if (array === null || array.length === 0) return 0;

  var ratings = array.reduce(function(obj, startCount) {
    if (!obj[startCount]) {
      obj[startCount] = 0;
    }
    obj[startCount]++;
    return obj;
  }, {});

  var weightedRatingCount = 0;
  for (let rating in ratings) {
    weightedRatingCount += rating * ratings[rating];
  }

  var totalRatingsCount = 0;
  for (let rating in ratings) {
    totalRatingsCount += ratings[rating];
  }

  return Math.ceil(weightedRatingCount / totalRatingsCount);
}
