const TEMP_RECT = new Tiny.Rectangle();
const BYTES_PER_PIXEL = 4;

/**
 * The extract manager provides functionality to export content from the renderers.
 *
 * An instance of this class is automatically created by default, and can be found at renderer.plugins.extract
 */
class WebGLExtract {
  /**
   * @param {Tiny.WebGLRenderer} renderer - A reference to the current renderer
   */
  constructor(renderer) {
    this.renderer = renderer;
    /**
     * Collection of methods for extracting data (image, pixels, etc.) from a display object or render texture
     *
     * @member {Tiny.extract.WebGLExtract} extract
     * @memberof Tiny.WebGLRenderer#
     * @see Tiny.extract.WebGLExtract
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
   * Will return a a base64 encoded string of this target. It works by calling `WebGLExtract.getCanvas` and then running toDataURL on that.
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
   * @param {Tiny.Rectangle} [region] - A rect region the you want
   * @param {number} [fillColor] - When the alpha is 0, it will be fill with this color
   * @return {HTMLCanvasElement} A Canvas element with the texture rendered on.
   */
  canvas(target, region, fillColor) {
    if (!region && !fillColor) {
      return this._canvas(target);
    }

    const renderer = this.renderer;
    const { resolution } = renderer;
    const renderTexture = renderer.generateTexture(target, undefined, resolution, region);
    let result = this._canvas(renderTexture);

    if (fillColor) {
      const frame = region || renderTexture.frame;
      const canvasData = result.getContext('2d').getImageData(0, 0, frame.width * resolution, frame.height * resolution);
      const canvasBuffer = new Tiny.CanvasRenderTarget(frame.width * resolution, frame.height * resolution, 1);

      for (let i = 0, n = canvasData.data.length / 4; i < n; i++) {
        if (canvasData.data[i * 4 + 3] === 0) {
          canvasData.data[(i * 4)] = (fillColor & 0xff0000) >> 16;
          canvasData.data[(i * 4) + 1] = (fillColor & 0x00ff00) >> 8;
          canvasData.data[(i * 4) + 2] = (fillColor & 0x0000ff);
          canvasData.data[(i * 4) + 3] = 255;
        }
      }

      canvasBuffer.context.putImageData(canvasData, 0, 0);
      result = canvasBuffer.canvas;
    }

    return result;
  }

  _canvas(target) {
    const renderer = this.renderer;
    let textureBuffer;
    let resolution;
    let frame;
    let flipY = false;
    let renderTexture;
    let generated = false;

    if (target) {
      if (target instanceof Tiny.RenderTexture) {
        renderTexture = target;
      } else {
        renderTexture = this.renderer.generateTexture(target);
        generated = true;
      }
    }

    if (renderTexture) {
      textureBuffer = renderTexture.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID];
      resolution = textureBuffer.resolution;
      frame = renderTexture.frame;
      flipY = false;
    } else {
      textureBuffer = this.renderer.rootRenderTarget;
      resolution = textureBuffer.resolution;
      flipY = true;

      frame = TEMP_RECT;
      frame.width = textureBuffer.size.width;
      frame.height = textureBuffer.size.height;
    }

    const width = Math.floor((frame.width * resolution) + 1e-4);
    const height = Math.floor((frame.height * resolution) + 1e-4);

    const canvasBuffer = new Tiny.CanvasRenderTarget(width, height, 1);

    if (textureBuffer) {
      // bind the buffer
      renderer.bindRenderTarget(textureBuffer);

      // set up an array of pixels
      const webglPixels = new Uint8Array(BYTES_PER_PIXEL * width * height);

      // read pixels to the array
      const gl = renderer.gl;

      gl.readPixels(
        frame.x * resolution,
        frame.y * resolution,
        width,
        height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        webglPixels
      );

      // add the pixels to the canvas
      const canvasData = canvasBuffer.context.getImageData(0, 0, width, height);

      canvasData.data.set(webglPixels);

      canvasBuffer.context.putImageData(canvasData, 0, 0);

      // pulling pixels
      if (flipY) {
        canvasBuffer.context.scale(1, -1);
        canvasBuffer.context.drawImage(canvasBuffer.canvas, 0, -height);
      }
    }

    if (generated) {
      renderTexture.destroy(true);
    }
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
    let textureBuffer;
    let resolution;
    let frame;
    let renderTexture;
    let generated = false;

    if (target) {
      if (target instanceof Tiny.RenderTexture) {
        renderTexture = target;
      } else {
        renderTexture = this.renderer.generateTexture(target);
        generated = true;
      }
    }

    if (renderTexture) {
      textureBuffer = renderTexture.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID];
      resolution = textureBuffer.resolution;
      frame = renderTexture.frame;
    } else {
      textureBuffer = this.renderer.rootRenderTarget;
      resolution = textureBuffer.resolution;

      frame = TEMP_RECT;
      frame.width = textureBuffer.size.width;
      frame.height = textureBuffer.size.height;
    }

    const width = frame.width * resolution;
    const height = frame.height * resolution;

    const webglPixels = new Uint8Array(BYTES_PER_PIXEL * width * height);

    if (textureBuffer) {
      // bind the buffer
      renderer.bindRenderTarget(textureBuffer);
      // read pixels to the array
      const gl = renderer.gl;

      gl.readPixels(
        frame.x * resolution,
        frame.y * resolution,
        width,
        height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        webglPixels
      );
    }

    if (generated) {
      renderTexture.destroy(true);
    }
    return webglPixels;
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

Tiny.WebGLRenderer.registerPlugin('extract', WebGLExtract);

export default WebGLExtract;
