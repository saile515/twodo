import { Bundle, BundleInstance } from "../types/util";

import { Context } from "../context";

export type System<T extends BundleInstance<Bundle> | undefined = undefined> =
    T extends BundleInstance<Bundle>
        ? (context: Context, instance: T) => void
        : (context: Context) => void;
