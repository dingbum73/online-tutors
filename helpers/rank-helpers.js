const rankIndex = array => {
  if (!array || !array.length) return []

  for (let i = 0; i < array.length; i++) {
    array[i].rank = i + 1
  }
  return array
}

const myRank = (userId, allRank) => {
  const ranks = rankIndex(allRank)
  const result = ranks.find(r => r.user_id === userId)
  console.log(result)
  if (result) {
    return result.rank
  } else {
    return null
  }
}

module.exports = {
  rankIndex,
  myRank
}
