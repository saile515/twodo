import Mouse from "./mouse.ts";

export default class InputManager {
    private _mouse = new Mouse();

    get mouse() {
        return this._mouse;
    }
}
