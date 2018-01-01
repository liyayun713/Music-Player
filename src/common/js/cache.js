// 操作和 storage 相关的逻辑
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertArray (arr, val, compare, maxLen) {
  // 比较函数
  const index = arr.findIndex(compare)
  // 如果在数组的首位则什么都不做
  if (index === 0) {
    return
  }
  // 如果存在相同的，则删除老数据
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 插入到数组的头部
  arr.unshift(val)
  // 如果大于最大长度，则删去最后一个
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 存储并返回
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
