/* eslint-disable no-console */

import '../css/a.css';
import '../css/b.css';

const add = function add(x, y) {
  return x + y;
}; // eslint-disable-next-line

console.log(add(1, 2));
const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了~');
    resolve();
  }, 1000);
}); // eslint-disable-next-line no-console

console.log(promise);
