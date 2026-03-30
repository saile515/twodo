import { Context } from "../context";
import { Vector2 } from "../types/vector";

export type MouseClickCallback = () => unknown;
export type MouseClickCallbackType = "leftClick" | "rightClick" | "middleClick";

export class Mouse {
    private _position = new Vector2(0, 0);
    private _lastPosition: Vector2 | null = null;
    private _callbacks: {
        [key in MouseClickCallbackType]: MouseClickCallback[];
    } = {
        leftClick: [],
        rightClick: [],
        middleClick: [],
    };

    constructor(context: Context) {
        window.addEventListener("mousemove", (event) => {
            this._position = new Vector2(
                (event.offsetX / context.gl.canvas.width) * 2 - 1,
                (event.offsetY / context.gl.canvas.height) * 2 - 1,
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
        return Vector2.subtract(
            this._position,
            this._lastPosition ?? this._position,
        );
    }

    get position() {
        return this._position;
    }

    registerCallback(
        type: MouseClickCallbackType,
        callback: MouseClickCallback,
    ) {
        this._callbacks[type].push(callback);
        return callback;
    }

    unregisterCallback(
        type: MouseClickCallbackType,
        callback: MouseClickCallback,
    ) {
        this._callbacks[type] = this._callbacks[type].filter(
            (element) => element != callback,
        );
    }
}
