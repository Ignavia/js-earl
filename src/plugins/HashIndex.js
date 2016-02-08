import {Plugin} from "@ignavia/util";

/**
 * An index that maps from a hash value to all objects with that hash value.
 */
export default class HashIndex extends Plugin {

    /**
     * @param {Function} hashFunction
     * A function that gets an object as input and returns a deterministic,
     * immutable value. If an object should not be included in the index the
     * function can return undefined.
     */
    constructor(hashFunction) {
        super();

        /**
         * A function that gets an object as input and returns a deterministic,
         * immutable value.
         *
         * @type {Function}
         * @protected
         */
        this.hash = hashFunction;

        /**
         * Maps from a hash value to a set with the IDs of all corresponding
         * objects.
         *
         * @type {Map<*, Set<String>>}
         * @protected
         */
        this.hashToIds = new Map();

        this.idToHash = new Map();
    }

    /**
     * Returns an array containing the IDs of the objects with the given hash
     * value.
     *
     * @param {*} param
     * The hash value or the object to hash.
     *
     * @param {Boolean} [hashParam=false]
     * Whether the first argument has to be hashed first before using it as a
     * key.
     *
     * @return {String[]}
     * The IDs of the selected objects.
     *
     * @private
     */
    get(param, hashParam = false) {
        return [...this.iter(param, hashParam)];
    }

    /**
     * Iterates over the IDs of the objects with the given hash value.
     *
     * @param {*} param
     * The hash value.
     *
     * @param {Boolean} [hashParam=false]
     * Whether the first argument has to be hashed first before using it as a
     * key.
     *
     * @private
     */
    * iter(param, hashParam) {
        hashParam = hashParam || false; // TODO change to default parameter (babel bug)

        if (hashParam) {
            param = this.hash(param);
        }
        if (this.data.has(param)) {
            yield* this.data.get(param).values();
        }
    }

    /**
     * Returns the number of objects with the given hash value.
     *
     * @param {*} param
     * The hash value.
     *
     * @param {Boolean} [hashParam=false]
     * Whether the first argument has to be hashed first before using it as a
     * key.
     *
     * @private
     */
    count(param, hashParam = false) {
        if (hashParam) {
            param = this.hash(param);
        }
        return this.data.has(param) ? this.data.get(param).size : 0;
    }

    /**
     * Tests if objects with the given hash value exist.
     *
     * @param {*} param
     * The hash value.
     *
     * @param {Boolean} [hashParam=false]
     * Whether the first argument has to be hashed first before using it as a
     * key.
     *
     * @private
     */
    test(param, hashParam = false) {
        if (hashParam) {
            param = this.hash(param);
        }
        return this.data.has(param);
    }

    /**
     * Adds the objects to the index.
     *
     * @param {Event} e
     * The received event.
     *
     * @private
     */
    add(e) {
        const objs = e.data;

        for (let obj of objs) {
            const key = this.hash(obj);

            if (key !== undefined) {
                if (!this.data.has(key)) {
                    this.data.set(key, new Set()) ;
                }
                this.data.get(key).add(obj.id);
            }
        }
    }

    /**
     * Removes the objects from the index.
     *
     * @param {Event} e
     * The received event.
     *
     * @private
     */
    remove(e) {
        const objs = e.data;

        for (let obj of objs) {
            const key = this.hash(obj);
            if (this.data.has(key)) {
                const set = this.data.get(key);

                set.delete(obj.id);
                if (set.size === 0) {
                    this.data.delete(key);
                }
            }
        }
    }
}
