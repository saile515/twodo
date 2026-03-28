import { Vector2 } from "../types/vector";

export type MouseClickCallback = () => unknown;

export class Mouse {
    private _position = new Vector2(0, 0);
    private _lastPosition: Vector2 | null = null;
    private _callbacks = {
        leftClick: [] as MouseClickCallback[],
        rightClick: [] as MouseClickCallback[],
        middleClick: [] as MouseClickCallback[],
    };

    constructor() {
        window.addEventListener("mousemove", (event) => {
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
        return Vector2.subtract(
            this._position,
            this._lastPosition ?? this._position,
        );
    }

    get position() {
        return this._position;
    }

    registerCallback(
        type: keyof typeof this._callbacks,
        callback: MouseClickCallback,
    ) {
        this._callbacks[type].push(callback);
        return callback;
    }

    unregisterCallback(
        type: keyof typeof this._callbacks,
        callback: MouseClickCallback,
    ) {
        this._callbacks[type] = this._callbacks[type].filter(
            (element) => element != callback,
        );
    }
}
