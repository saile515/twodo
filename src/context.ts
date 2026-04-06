import { Bundle, BundleInstance } from "./types/util";

import { ECS } from "./ecs/ecs";
import { InputManager } from "./input/input-manager";
import { System } from "./ecs/system";
import { createWebGLContext } from "./graphics/webgl";

export class Context {
    readonly input;
    readonly ecs = new ECS();
    readonly gl: WebGL2RenderingContext;
    private _lastUpdate = 0;
    private _deltaTime = 0;

    constructor(canvas: HTMLCanvasElement) {
        canvas.tabIndex = 0;
        this.gl = createWebGLContext(canvas);
        this.input = new InputManager(this);
    }

    get deltaTime() {
        return this._deltaTime;
    }

    invoke<T extends Bundle>(system: System<BundleInstance<T>>, query: T): void;
    invoke(system: System): void;
    invoke(system: System<any>, query?: Bundle) {
        if (!query) {
            (system as System)(this);
            return;
        }

        this.ecs.query(query).forEach((instance) => system(this, instance));
    }

    startUpdate() {
        const now = performance.now();
        this._deltaTime = (now - this._lastUpdate) / 1000;
        this._lastUpdate = now;
    }
}
