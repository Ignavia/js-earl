import HashIndex from "./HashIndex.js";

/**
 * An index that maps from a hash value to the IDs of all nodes with that hash
 * value. It adds a getter and an iterator to a graph when it is plugged in.
 */
export default class NodeHashIndex extends HashIndex {

    /**
     * @param {Function} hashFunction
     * A function that gets a node as input and returns a deterministic,
     * immutable value.
     *
     * @param {Object} mixinNames
     * Provides names for the mixin functions.
     *
     * @param {String} [mixinNames.getterName]
     * The name of the getter function. This returns the IDs of all nodes with
     * the given hash. It is also possible to provide a node object instead of
     * a hash and set the second parameter to true. Then the node is hashed
     * first and the result is used as hash.
     *
     * @param {String} [mixinNames.iteratorName]
     * The name of the iterator function. This iterates over the IDs of all
     * nodes with the given hash. It is also possible to provide a node object
     * instead of a hash and set the second parameter to true. Then the node is
     * hashed first and the result is used as hash.
     *
     * @param {String} [mixinNames.counterName]
     * The name of the counter function. This returns the number of all nodes
     * with the given hash. It is also possible to provide a node object
     * instead of a hash and set the second parameter to true. Then the node is
     * hashed first and the result is used as hash.
     *
     * @param {String} [mixinNames.testerName]
     * The name of the tester function. This tests whether nodes with the given
     * hash value exist. It is also possible to provide a node object instead of
     * a hash and set the second parameter to true. Then the node is hashed
     * first and the result is used as hash.
     */
    constructor(hashFunction, {getterName, iteratorName, counterName, testerName} = {}) {
        super(hashFunction);

        /**
         * The names of the mixin functions.
         *
         * @type {Object}
         *
         * @property {String} mixinNames.getterName
         * The name of the getter function.
         *
         * @property {String} mixinNames.iteratorName
         * The name of the iterator function.
         *
         * @property {String} mixinNames.counterName
         * The name of the counter function.
         *
         * @property {String} mixinNames.testerName
         * The name of the tester function.
         *
         * @private
         */
        this.mixinNames = {getterName, iteratorName, counterName, testerName};

        /**
         * The graph this plugin was added to.
         *
         * @type {Graph}
         */
        this.graph = undefined;
    }

    /**
     * @override
     */
    register(graph) {
        this.graph = graph;

        // Add mixins
        if (this.mixinNames.getterName) {
            graph.addMethod(this.mixinNames.getterName, this.get, this);
        }
        if (this.mixinNames.iteratorName) {
            graph.addMethod(this.mixinNames.iteratorName, this.iter, this);
        }
        if (this.mixinNames.counterName) {
            graph.addMethod(this.mixinNames.counterName, this.count, this);
        }
        if (this.mixinNames.testerName) {
            graph.addMethod(this.mixinNames.testerName, this.test, this);
        }

        // Add listeners
        graph.addListener(["addNodes", "afterUpdateNodes"],     this.add,     this) // TODO
             .addListener(["removeNodes", "beforeUpdateNodes"], this.remove,  this)
             .addListener("reindexNodes",                       this.reindex, this);

        // Add nodes
        this.reindex();
    }

    /**
     * Returns a new NodeHashIndex using the same hash function and mixin names.
     *
     * @return {NodeHashIndex}
     * A copy of this plugin.
     *
     * @override
     */
    clone() {
        return new NodeHashIndex(this.hash, this.mixinNames);
    }

    /**
     * Clear the complete index and add all nodes again.
     *
     * @param {Event} [e]
     * The event causing this request.
     *
     * @return {[type]}   [description]
     */
    reindex(e) {
        this.hashToIds.clear();
        this.idToHash.clear();
        this.add({data: this.graph.iterNodes()});
    }
}
