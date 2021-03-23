import '../css/index.css';
import { mui } from './test';

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

// eslint-disable-next-line
console.log(mui(2, 3));

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4));
