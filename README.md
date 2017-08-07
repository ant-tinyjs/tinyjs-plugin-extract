# tinyjs-plugin-extract

> 画布扩展，获取画布的：Image 对象、base64 格式的图片、像素值等等

## 查看demo

`demo/index.html`

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-extract --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-extract/1.0.6/index.js
  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-extract/1.0.6/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="https://a.alipayobjects.com/g/tiny/tiny/1.0.2/tiny.js"></script>
```
``` js
require('tinyjs-plugin-extract');
// 或者
// import * as extract from 'tinyjs-plugin-extract';

// 新建 App
const app = new Tiny.Application();
const texture = Tiny.Texture.fromImage('https://zos.alipayobjects.com/rmsportal/nJBojwdMJfUqpCWvwyoA.png');
const sprite = new Tiny.Sprite(texture);
texture.on('update', function () {
  const image = app.renderer.plugins.extract.image(sprite);
  console.log(image);
  //=> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsC..SuQmCC">
});
```

## 依赖
- `Tiny.js`: [Link](http://tinyjs.net/#/docs/api)

