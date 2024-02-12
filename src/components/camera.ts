import Component from "../ecs/component.ts";
import Transform from "../components/transform.ts";
import { mat3, vec2 } from "gl-matrix";

export default class Camera extends Component {
    private _projection_matrix = mat3.create();

    constructor(viewport_width: number, viewport_height: number) {
        super();
        this.calculate_projection_matrix(viewport_width, viewport_height);
    }

    calculate_projection_matrix(viewport_width: number, viewport_height: number) {
        mat3.projection(this._projection_matrix, viewport_width, viewport_height);
        mat3.translate(this._projection_matrix, this._projection_matrix, [viewport_width / 2, viewport_height / 2]);
        // Create appropriate scale relative to screen width
        mat3.scale(
            this._projection_matrix,
            this._projection_matrix,
            vec2.fromValues(viewport_width / 25, -viewport_width / 25),
        );
    }

    get projection_matrix() {
        return this._projection_matrix;
    }
}

export type CameraBundle = [Camera, Transform];
