import JSONP from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + Obj2Url(data);

  return new Promise((resolve, reject) => {
    JSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function Obj2Url (data) {
  let url = '';
  for (let k in data) {
    let value = data[k] ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}
