import { Context } from "../context";
import { Mouse } from "./mouse";

export class InputManager {
    private _mouse: Mouse;

    constructor(context: Context) {
        this._mouse = new Mouse(context);
    }

    get mouse() {
        return this._mouse;
    }
}
