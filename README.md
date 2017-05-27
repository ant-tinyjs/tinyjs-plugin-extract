# tinyjs-plugin-extract

> Tiny.js renderer-specific plugins for exporting content from a renderer

## 查看demo

`demo/index.html`

## 引用方法

* 推荐作为依赖使用

  * `npm install @tinyjs/tinyjs-plugin-extract --save`

* 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  * TODO

## 概述
Tiny.js renderer-specific plugins for exporting content from a renderer

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="http://tinyjs.net/libs/tiny.debug.js"></script>
```
``` js
var extract = require('@tinyjs/tinyjs-plugin-extract');

// 新建 App
const app = new Tiny.Application({
  height: document.documentElement['clientWidth']
});
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

## API文档

`docs`
