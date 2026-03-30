import { Context } from "../context";

export enum TextureStatus {
    Loading = "loading",
    Ready = "ready",
    Failed = "failed",
}

export class Texture {
    private _gl: WebGL2RenderingContext;
    private _texture: WebGLTexture;
    private _image = new Image();
    private _status = TextureStatus.Loading;

    constructor(context: Context, imageSource: string) {
        this._gl = context.gl;
        this._texture = this._gl.createTexture();

        this._image.addEventListener(
            "error",
            () => (this._status = TextureStatus.Failed),
        );
        this._image.addEventListener("load", () => this.handleLoadedImage());

        this._image.src = imageSource;
    }

    private handleLoadedImage() {
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
        this._gl.texImage2D(
            this._gl.TEXTURE_2D,
            0,
            this._gl.RGBA,
            this._gl.RGBA,
            this._gl.UNSIGNED_BYTE,
            this._image,
        );

        this._gl.texParameteri(
            this._gl.TEXTURE_2D,
            this._gl.TEXTURE_WRAP_S,
            this._gl.CLAMP_TO_EDGE,
        );
        this._gl.texParameteri(
            this._gl.TEXTURE_2D,
            this._gl.TEXTURE_WRAP_T,
            this._gl.CLAMP_TO_EDGE,
        );
        this._gl.texParameteri(
            this._gl.TEXTURE_2D,
            this._gl.TEXTURE_MIN_FILTER,
            this._gl.NEAREST,
        );
        this._gl.texParameteri(
            this._gl.TEXTURE_2D,
            this._gl.TEXTURE_MAG_FILTER,
            this._gl.NEAREST,
        );
        this._status = TextureStatus.Ready;
    }

    get status() {
        return this._status;
    }

    use() {
        if (this._status == TextureStatus.Failed) {
            throw new Error("Texture failed to load.");
        }

        if (this._status == TextureStatus.Loading) {
            throw new Error("Texture has not finished loading.");
        }

        this._gl.activeTexture(this._gl.TEXTURE0);
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
    }
}
