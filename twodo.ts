import Scene from "./src/scene.ts";

import ECS from "./src/ecs/ecs.ts";
import Component from "./src/ecs/component.ts";
import Entity from "./src/ecs/entity.ts";

import Buffer from "./src/graphics/buffer.ts";
import Shader from "./src/graphics/shader.ts";
import Texture from "./src/graphics/texture.ts";

import Camera from "./src/components/camera.ts";
import Sprite from "./src/components/sprite.ts";
import Transform from "./src/components/sprite.ts";

import { Vector2 } from "./src/types/vector.ts";

const Twodo = { Scene, ECS, Component, Entity, Buffer, Shader, Texture, Camera, Sprite, Transform, Vector2 };
export default Twodo;
