/**
 * It provides renderer-specific plugins for exporting content from a renderer.
 * For instance, these plugins can be used for saving an Image, Canvas element or for exporting the raw image data (pixels).
 *
 * Do not instantiate these plugins directly. It is available from the `renderer.plugins` property.
 * See {@link Tiny.CanvasRenderer#plugins} or {@link Tiny.WebGLRenderer#plugins}.
 *
 * @example
 * // Create a new app (will auto-add extract plugin to renderer)
 * const app = new Tiny.Application();
 *
 * // Draw a red circle
 * const graphics = new Tiny.Graphics()
 *     .beginFill(0xFF0000)
 *     .drawCircle(0, 0, 50);
 *
 * // Render the graphics as an HTMLImageElement
 * const image = app.renderer.plugins.extract.image(graphics);
 * document.body.appendChild(image);
 *
 * @namespace extract
 */
import webgl from './webgl/WebGLExtract';
import canvas from './canvas/CanvasExtract';

export {
  webgl,
  canvas,
};
