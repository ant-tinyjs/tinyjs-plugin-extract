/**
 * 等比缩放
 *
 * @example
 * const canvas = app.renderer.plugins.extract.canvas(container, new Tiny.Rectangle(0, 0, 180, 100));
 * const base64 = Tiny.extract.scale(canvas, 200, 200).toDataURL('image/jpeg');
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @param {number|string} [fillColor=0xffffff] - 填充色值，如：0xffff00、'#ffff00'
 */
function scale(canvas, width, height, fillColor = 0xffffff) {
  const ow = canvas.width;
  const oh = canvas.height;
  const s = Math.min(width / ow, height / oh);
  const x = (width / s - ow) / 2;
  const y = (height / s - oh) / 2;
  const color = Tiny.isNumber(fillColor) ? Tiny.hex2string(fillColor) : fillColor;
  const canvasBuffer = new Tiny.CanvasRenderTarget(width, height, 1);

  canvasBuffer.context.scale(s, s);
  canvasBuffer.context.fillStyle = color;
  canvasBuffer.context.fillRect(0, 0, width / s, height / s);
  canvasBuffer.context.drawImage(canvas, x, y);

  return canvasBuffer.canvas;
}

export {
  scale,
};
