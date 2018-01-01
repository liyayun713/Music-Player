function getRandomNum (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomListFn (list) {
  // 副本，不会修改原数组
  let _list = list.slice();
  for (var i = 0; i < _list.length; i++) {
    var random = getRandomNum(i, _list.length);
    let temp = _list[i];
    _list[i] = _list[random];
    _list[random] = temp;
  }
  return _list;
}

// 节流函数，类似于函数柯里化
export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
