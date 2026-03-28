export class Texture {
    private _texture: WebGLTexture;
    private _image = new Image();
    private _failed = false;

    constructor(imageSource: string) {
        this._image.src = imageSource;
        this._texture = gl.createTexture()!;

        this._image.addEventListener("error", () => (this._failed = true));
    }

    private handleLoadedImage() {
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this._image,
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    init() {
        return new Promise<void>((resolve, reject) => {
            if (this._failed) {
                reject("Image could not be loaded.");
                return;
            }

            if (this._image.complete) {
                this.handleLoadedImage();
                resolve();
                return;
            }

            this._image.addEventListener("load", () => {
                this.handleLoadedImage();
                resolve();
            });

            this._image.addEventListener("error", () => {
                reject("Image could not be loaded");
            });
        });
    }

    use() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }
}
