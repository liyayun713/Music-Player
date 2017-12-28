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
