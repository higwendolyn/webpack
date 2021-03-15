import './index.css';
/* 
    index.js: webpak起点入口文件
    运行指令：
        开发环境指令：webpack ./src/index.js -o ./build/build.js --mode=development
        生产环境指令：webpack ./src/index.js -o ./build/build.js --mode=production
*/

function add(x, y) {
    return x + y;
}

console.log(add(1, 2));