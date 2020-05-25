const TEMP_RECT = new Tiny.Rectangle();

/**
 * The extract manager provides functionality to export content from the renderers.
 *
 * An instance of this class is automatically created by default, and can be found at renderer.plugins.extract
 */
class CanvasExtract {
  /**
   * @param {Tiny.CanvasRenderer} renderer - A reference to the current renderer
   */
  constructor(renderer) {
    this.renderer = renderer;
    /**
     * Collection of methods for extracting data (image, pixels, etc.) from a display object or render texture
     *
     * @member {Tiny.extract.CanvasExtract} extract
     * @memberof Tiny.CanvasRenderer#
     * @see Tiny.extract.CanvasExtract
     */
    renderer.extract = this;
  }

  /**
   * Will return a HTML Image of the target
   *
   * @param {Tiny.DisplayObject|Tiny.RenderTexture} target - A displayObject or renderTexture to convert. If left empty will use use the main renderer
   * @return {HTMLImageElement} HTML Image of the target
   */
  image(target) {
    const image = new Image();

    image.src = this.base64(target);

    return image;
  }

  /**
   * Will return a a base64 encoded string of this target. It works by calling `CanvasExtract.getCanvas` and then running toDataURL on that.
   *
   * @param {Tiny.DisplayObject|Tiny.RenderTexture} target - A displayObject or renderTexture to convert. If left empty will use use the main renderer
   * @return {string} A base64 encoded string of the texture.
   */
  base64(target) {
    return this.canvas(target).toDataURL();
  }

  /**
   * Creates a Canvas element, renders this target to it and then returns it.
   *
   * @param {Tiny.DisplayObject|Tiny.RenderTexture} target - A displayObject or renderTexture to convert. If left empty will use use the main renderer
   * @return {HTMLCanvasElement} A Canvas element with the texture rendered on.
   */
  canvas(target) {
    const renderer = this.renderer;
    let context;
    let resolution;
    let frame;
    let renderTexture;

    if (target) {
      if (target instanceof Tiny.RenderTexture) {
        renderTexture = target;
      } else {
        renderTexture = renderer.generateTexture(target);
      }
    }

    if (renderTexture) {
      context = renderTexture.baseTexture._canvasRenderTarget.context;
      resolution = renderTexture.baseTexture._canvasRenderTarget.resolution;
      frame = renderTexture.frame;
    } else {
      context = renderer.rootContext;
      resolution = renderer.resolution;
      frame = TEMP_RECT;
      frame.width = this.renderer.width;
      frame.height = this.renderer.height;
    }

    const width = Math.floor((frame.width * resolution) + 1e-4);
    const height = Math.floor((frame.height * resolution) + 1e-4);

    const canvasBuffer = new Tiny.CanvasRenderTarget(width, height, 1);
    const canvasData = context.getImageData(frame.x * resolution, frame.y * resolution, width, height);

    canvasBuffer.context.putImageData(canvasData, 0, 0);

    // send the canvas back..
    return canvasBuffer.canvas;
  }

  /**
   * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA order, with integer values between 0 and 255 (included).
   *
   * @param {Tiny.DisplayObject|Tiny.RenderTexture} target - A displayObject or renderTexture to convert. If left empty will use use the main renderer
   * @return {Uint8ClampedArray} One-dimensional array containing the pixel data of the entire texture
   */
  pixels(target) {
    const renderer = this.renderer;
    let context;
    let resolution;
    let frame;
    let renderTexture;

    if (target) {
      if (target instanceof Tiny.RenderTexture) {
        renderTexture = target;
      } else {
        renderTexture = renderer.generateTexture(target);
      }
    }

    if (renderTexture) {
      context = renderTexture.baseTexture._canvasRenderTarget.context;
      resolution = renderTexture.baseTexture._canvasRenderTarget.resolution;
      frame = renderTexture.frame;
    } else {
      context = renderer.rootContext;

      frame = TEMP_RECT;
      frame.width = renderer.width;
      frame.height = renderer.height;
    }

    return context.getImageData(0, 0, frame.width * resolution, frame.height * resolution).data;
  }

  /**
   * Destroys the extract
   *
   */
  destroy() {
    this.renderer.extract = null;
    this.renderer = null;
  }
}

Tiny.CanvasRenderer.registerPlugin('extract', CanvasExtract);

export default CanvasExtract;
