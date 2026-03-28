import { Mouse } from "./mouse";

export class InputManager {
    private _mouse = new Mouse();

    get mouse() {
        return this._mouse;
    }
}
