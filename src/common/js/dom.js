export function addClass (el, className) {
  if (hasClass(el, className)) return;
  let newClass = el.className.split(' ');
  newClass.push(className)
  el.className = newClass.join(' ');
};

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
};

export function getData (el, name, val) {
  // 自己实现的方法
  // if (val) {
  //   el.target.dataset[name] = val;
  //   return;
  // }
  // return el.target.dataset[name];

  // 课程实现
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}
