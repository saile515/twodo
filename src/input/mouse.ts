import { Vector2 } from "../types/vector.ts";
import { Callback } from "../types/util.ts";

export default class Mouse {
    private _position = new Vector2(0, 0);
    private _last_position: Vector2 | null = null;
    private _callbacks = {
        left_click: [] as Callback[],
        right_click: [] as Callback[],
        middle_click: [] as Callback[],
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
                    this._callbacks.left_click.forEach((callback) => callback());
                    break;
                case 1:
                    this._callbacks.right_click.forEach((callback) => callback());
                    break;
                case 2:
                    this._callbacks.middle_click.forEach((callback) => callback());
                    break;
                default:
                    break;
            }
        });
    }

    clear_delta() {
        this._last_position = new Vector2(this._position.x, this._position.y);
    }

    get delta() {
        // Fall back to returning delta 0 if last position does not exist.
        return Vector2.sub(this._position, this._last_position || this._position);
    }

    get position() {
        return this._position;
    }

    register_callback(type: "left_click" | "right_click" | "middle_click", callback: Callback) {
        this._callbacks[type].push(callback);
        return callback;
    }

    unregister_callback(callback: Callback) {
        for (let callback_type in this._callbacks) {
            this._callbacks[callback_type as keyof typeof this._callbacks] = this._callbacks[
                callback_type as keyof typeof this._callbacks
            ].filter((element) => element != callback);
        }
    }
}
