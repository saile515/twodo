export class Collection<T> extends Array<T> {
    first() {
        return this.at(0);
    }

    last() {
        return this.at(-1);
    }

    groupBy<K>(selector: (entry: T) => K) {
        const result = new Map<K, Collection<T>>();

        for (const entry of this) {
            const key = selector(entry);
            let collection = result.get(key);

            if (!collection) {
                collection = new Collection<T>();
                result.set(key, collection);
            }

            collection.push(entry);
        }

        return result;
    }

    sortBy<K extends string | number | bigint | boolean>(
        selector: (entry: T) => K,
    ) {
        return new Collection<T>(...this).sort((a, b) => {
            const valueA = selector(a);
            const valueB = selector(b);

            if (typeof valueA != typeof valueB) {
                return 0;
            }

            switch (typeof valueA) {
                case "number":
                    return valueA - (valueB as number);
                case "string":
                    return valueA.localeCompare(valueB as string, "en");
                case "boolean":
                    return +valueA - +(valueB as boolean);
                case "bigint":
                    return Number(valueA - (valueB as bigint));
                default:
                    return 0;
            }
        });
    }
}
