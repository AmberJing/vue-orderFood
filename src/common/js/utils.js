/**
 * 解析url参数
 * Created by Amber on 2016-12-28.
 * @example ?id=12345&a=b
 * @return Object {id:12334}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=123454','&a=b']

  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      // let key = decodeURIComponrent(tempArr[0]);
      // let val = decodeURIComponrent(tempArr[1]);
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  return obj;
};
