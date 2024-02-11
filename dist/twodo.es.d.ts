/// <reference types="gl-matrix/index" />

import { mat3 } from 'gl-matrix';

declare type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export declare class Buffer {
    private _buffer;
    private _target;
    private _usage;
    readonly components: number;
    constructor(settings?: {
        target: GLenum;
        usage: GLenum;
        components: number;
    });
    set(data: number[]): void;
    get(): WebGLBuffer;
    bind(): void;
}

export declare class Camera extends Component {
    private _projection_matrix;
    constructor(viewport_width: number, viewport_height: number);
    calculate_projection_matrix(viewport_width: number, viewport_height: number): void;
    get projection_matrix(): mat3;
}

export declare type CameraBundle = [Camera, Transform];

export declare class Component {
    private _parent;
    set_parent(parent: Entity): void;
    get parent(): Entity | null;
}

export declare class ECS {
    private _entities;
    private _components;
    private add_component;
    create_entity<T extends Component[]>(components: T): T;
    query<T extends Array<Component>>(query: (new (...arg: any[]) => ArrayElement<T>)[]): T[];
}

export declare class Entity {
    readonly id: `${string}-${string}-${string}-${string}-${string}`;
}

export declare class InputManager {
    private _mouse;
    get mouse(): Mouse;
}

declare class Mouse {
    private _position;
    private _last_position;
    constructor();
    clear_delta(): void;
    get delta(): Vector2;
}

export declare class Scene {
    private _active_camera;
    readonly input: InputManager;
    readonly ecs: ECS;
    constructor(canvas: HTMLCanvasElement);
    set_active_camera(camera: CameraBundle): void;
    draw(): void;
}

export declare class Shader<Attributes extends string[], Uniforms extends string[]> {
    private _vertex;
    private _fragment;
    private _attribute_keys;
    private _uniform_keys;
    private _program;
    private _attributes;
    private _uniforms;
    constructor(vertex: string, fragment: string, attributes: Attributes, uniforms: Uniforms);
    compile(): Promise<void>;
    use(): void;
    set_attribute(attribute: Attributes[number], data: Buffer): void;
    set_uniform_float(uniform: Uniforms[number], data: number[], components: number): void;
    set_uniform_int(uniform: Uniforms[number], data: number[], components: number): void;
    set_uniform_vector(uniform: Uniforms[number], data: number[], components: number): void;
    set_uniform_matrix(uniform: Uniforms[number], data: Float32Array, components: number): void;
}

export declare class Sprite extends Component {
    private _texture;
    private _failed;
    private _texture_ready;
    constructor(image_source: string);
    draw(): void;
    get failed(): boolean;
    static get shader(): Shader<[], ["sampler", "vp_matrix", "model_matrix", "depth"]> | undefined;
}

export declare class Texture {
    private _texture;
    private _image;
    private _errored;
    constructor(image_source: string);
    private handle_loaded_image;
    init(): Promise<void>;
    use(): void;
}

export declare class Transform extends Component {
    private _matrix;
    private _position;
    private _scale;
    private _rotation;
    private _depth;
    constructor();
    private calculate_matrix;
    set position(value: Vector2);
    set scale(value: Vector2);
    set rotation(value: number);
    set depth(value: number);
    get position(): Vector2;
    get scale(): Vector2;
    get rotation(): number;
    get depth(): number;
    get matrix(): mat3;
}

export declare class Vector2 {
    private _x;
    private _y;
    constructor(x: number, y: number);
    get x(): number;
    get y(): number;
    static sub(a: Vector2, b: Vector2): Vector2;
    static add(a: Vector2, b: Vector2): Vector2;
}

export { }
