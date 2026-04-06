import { Context } from "../context";
import { Event } from "../lib/event";
import { Vector2 } from "../types/vector";

export enum MouseButton {
    Left = "left",
    Right = "right",
    Middle = "middle",
}

export class Mouse {
    private _position = new Vector2(0, 0);
    private _lastPosition: Vector2 | null = null;
    private _left = false;
    private _right = false;
    private _middle = false;
    readonly clickEvent = new Event<[MouseButton]>();
    readonly moveEvent = new Event<[Vector2]>();

    constructor(context: Context) {
        const canvas = context.gl.canvas as HTMLCanvasElement;
        canvas.addEventListener("mousemove", (event) => {
            this._position = new Vector2(
                ((event.offsetX * devicePixelRatio) / context.gl.canvas.width) *
                    2 -
                    1,
                ((event.offsetY * devicePixelRatio) /
                    context.gl.canvas.height) *
                    2 -
                    1,
            );
            this.moveEvent.invoke(this._position);
        });

        canvas.addEventListener("click", (event) => {
            switch (event.button) {
                case 0:
                    this.clickEvent.invoke(MouseButton.Left);
                    break;
                case 1:
                    this.clickEvent.invoke(MouseButton.Right);
                    break;
                case 2:
                    this.clickEvent.invoke(MouseButton.Middle);
                    break;
                default:
                    break;
            }
        });

        canvas.addEventListener(
            "mousedown",
            this.mouseUpDownCallback.bind(this),
        );
        canvas.addEventListener("mouseup", this.mouseUpDownCallback.bind(this));
    }

    private mouseUpDownCallback(event: MouseEvent) {
        this._left = (event.buttons & 0b001) > 0;
        this._right = (event.buttons & 0b010) > 0;
        this._middle = (event.buttons & 0b100) > 0;
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

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    get middle() {
        return this._middle;
    }
}
