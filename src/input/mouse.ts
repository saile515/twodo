import { Vector2 } from "../types/vector.ts";

export default class Mouse {
    private _position = new Vector2(0, 0);
    private _last_position: Vector2;

    constructor() {
        window.addEventListener("mousemove", (event) => {
            this._position = new Vector2(event.offsetX, event.offsetY);
        });
    }

    clear_delta() {
        this._last_position = new Vector2(this._position.x, this._position.y);
    }

    get delta() {
        // Fall back to returning delta 0 if last position does not exist.
        return Vector2.sub(this._position, this._last_position || this._position);
    }
}
