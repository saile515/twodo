# Entitiy Component System

Twodo uses an data-oriented entity component system inspired by Bevy. Every scene provides 
an ECS through the `ecs` property. However, ECSs can also exist without a scene through the
`Twodo.ECS` class. The ECS is responsible for data and logic in the lifetime of the application.
To achieve this, entities, components, and systems are used.

## Entities

An entity in Twodo is a class containing just a single UUID. They should never be created manually. 
Instead they can be created with the `create_entity` method of the ECS. The `create_entity` method
is a generic function, which takes an array of component types as a type argument. An array of
components matching the types of the type argument are also passed as a regular argument. Components
can be created before the method call, or within the method call. The type argument can also be a
bundle, which is a type alias for an array of component types.

## Components

A component in Twodo is a class representing a certain property of an entity. A component can contain 
data, but can also be empty. When defining a component, the class needs to inherit from the 
`Twodo.Component` class. Components can also contain methods which handle local logic, 
not dependent on other components.

## Systems

A system in Twodo is simply a function which take one or more components as a parameter. A system
can be either a named function, or an anonymous function. Systems are used to handle logic that
is dependent on more than one component. Or logic which does not belong within the component.

Systems are often called after a query. A query is a method of the ECS. The `query` method takes a
type argument of an array of component types, and an identical regular argument. A query should only
contain the components which are required for the system. Therefore, a bundle should not be passed to
a query. The `query` function returns an array of arrays containing all instances of the specified 
components which belong the to same entity.

## Example

```ts
import * as Twodo from "twodo";

// An empty component is defined to differentiate between 
// other entities with Transform and Sprite components.
class Player extends Twodo.Component {}
type PlayerBundle = [Player, Twodo.Transform, Twodo.Sprite];

const canvas = document.getElementById("my_canvas");
const scene = new Twodo.Scene(canvas);

scene.ecs.create_entity<PlayerBundle>([new Player(), 
                                       new Twodo.Transform(), 
                                       new Twodo.Sprite("/player_sprite.png")]);

function update() {
    // Only query the components which are needed by the system.
    scene.ecs.query<[Player, Twodo.Transform]>([Player, Twodo.Transform])
    .forEach((player, transform) => {
        // Move the player up.
        transform.position = new Twodo.Vector2(0, transform.position.y + 0.1); 
    });

    requestAnimationFrame(update);
}

update();
```
