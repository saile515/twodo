import { Context } from "../context";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";

export class InputManager {
    readonly mouse: Mouse;
    readonly keyboard: Keyboard;

    constructor(context: Context) {
        this.mouse = new Mouse(context);
        this.keyboard = new Keyboard(context);
    }
}
