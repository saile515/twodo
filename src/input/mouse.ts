import { Callback } from "../types/util";
import { Vector2 } from "../types/vector";

export class Mouse {
    private _position = new Vector2(0, 0);
    private _lastPosition: Vector2 | null = null;
    private _callbacks = {
        leftClick: [] as Callback[],
        rightClick: [] as Callback[],
        middleClick: [] as Callback[],
    };

    constructor() {
        window.addEventListener("mousemove", (event) => {
            // Normalized coordinates between -1 and 1.
            this._position = new Vector2(
                (event.offsetX / gl.canvas.width) * 2 - 1,
                (event.offsetY / gl.canvas.height) * 2 - 1,
            );
        });

        window.addEventListener("click", (event) => {
            switch (event.button) {
                case 0:
                    this._callbacks.leftClick.forEach((callback) => callback());
                    break;
                case 1:
                    this._callbacks.rightClick.forEach((callback) =>
                        callback(),
                    );
                    break;
                case 2:
                    this._callbacks.middleClick.forEach((callback) =>
                        callback(),
                    );
                    break;
                default:
                    break;
            }
        });
    }

    clearDelta() {
        this._lastPosition = new Vector2(this._position.x, this._position.y);
    }

    get delta() {
        // Fall back to returning delta 0 if last position does not exist.
        return Vector2.sub(
            this._position,
            this._lastPosition || this._position,
        );
    }

    get position() {
        return this._position;
    }

    registerCallback(type: keyof typeof this._callbacks, callback: Callback) {
        this._callbacks[type].push(callback);
        return callback;
    }

    unregisterCallback(callback: Callback) {
        for (let callbackType in this._callbacks) {
            this._callbacks[callbackType as keyof typeof this._callbacks] =
                this._callbacks[
                    callbackType as keyof typeof this._callbacks
                ].filter((element) => element != callback);
        }
    }
}
