// 幫每筆資料加上index
const rankIndex = array => {
  if (!array || !array.length) return []

  for (let i = 0; i < array.length; i++) {
    array[i].rank = i + 1
  }
  return array
}

// 找出自己的index(排名)在哪裡
const myRank = (userId, allRank) => {
  const ranks = rankIndex(allRank)
  const result = ranks.find(r => r.user_id === userId)
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
