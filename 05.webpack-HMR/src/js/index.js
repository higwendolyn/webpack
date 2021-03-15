/* eslint-disable no-console */

import '../css/a.css';
import '../css/b.css';
import print from './print';

console.log('index.js文件被加载了~');

const add = function add(x, y) {
  return x + y;
}; 

print();

console.log(add(1, 2));
const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了~');
    resolve();
  }, 1000);
}); // eslint-disable-next-line no-console

console.log(promise);

if(module.hot) {
  // module.hot为true，开启了HMR功能 --> 让HMR功能代码生效
  module.hot.accept('./print.js', function () {
    // 方法会监听 prin.js 文件的变化，一旦发生变化，其他默认不会重新打包构建
    // 会执行后面的回调函数
    print();
  });
}
