# Sprite Component

## Description

The sprite component handles rendering of a 2D texture. It must have a `Transform` sibling component in order to render.

## Constructor Parameters

- src <string> Default value of `src` property.

## Properties

- hidden <boolean> Controls whether or not the sprite should be rendered. Default: `false`.
- src <string> The url to the image which the sprite should render.
- failed <read-only boolean> Is `true` if texture failed to initialize.
- (static) shader <read-only Shader | null> The common shader of all sprites.

## Methods

- draw() <void> Draws the sprite. This should not be called manually, unless the sprite exists outside a scene ECS.
