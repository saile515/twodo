export type EventSubscription = number & { __type: "event-subscription" };

export class Event<Args extends readonly any[] = []> {
    private _lastKey = 0;
    private _subscribers = new Map<
        EventSubscription,
        (...args: Args) => unknown
    >();

    subscribe(callback: (...args: Args) => unknown) {
        const key = this._lastKey++ as EventSubscription;
        this._subscribers.set(key, callback);
        return key;
    }

    unsubscribe(subscription: EventSubscription) {
        this._subscribers.delete(subscription);
    }

    invoke(...args: Args) {
        this._subscribers.forEach((callback) => callback(...args));
    }
}
