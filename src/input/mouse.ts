import { Vector2 } from "../types/vector.ts";

export default class Mouse {
    private _position = new Vector2(0, 0);
    private _last_position: Vector2 | null = null;

    constructor() {
        window.addEventListener("mousemove", (event) => {
            // Normalized coordinates between -1 and 1.
            this._position = new Vector2(
                (event.offsetX / gl.canvas.width) * 2 - 1,
                (event.offsetY / gl.canvas.height) * 2 - 1,
            );
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
}
