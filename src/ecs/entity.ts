export class Entity {
    private static _lastId = 0;
    readonly id = Entity._lastId++;
}
