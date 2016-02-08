import Graph from "./Graph.js";
import Path  from "./Path.js";

/**
 * Represents the result of a BFS algorithm.
 */
export default class BreadthFirstTree {

    /**
     * @param {String|Node} root
     * The node BFS was started at.
     *
     * @param {Function} getParent
     * Gets a node ID as input and maps to the ID of its BFS predecessor.
     *
     * @param {Function} getDistance
     * Gets a node ID as input and returns its distance from the root node.
     */
    constructor(root, getParent, getDistance) {

        /**
         * The ID if the root node.
         *
         * @type {String}
         */
        this.rootId = Graph.toNodeId(root);

        /**
         * Returns the predecessor in a shortest path from the root to the given
         * node.
         *
         * @type {Function}
         * @private
         */
        this.parent = getParent;

        /**
         * Returns the length in a shortest path from the root to the given
         * node.
         *
         * @type {Function}
         * @private
         */
        this.distance = getDistance;
    }

    /**
     * Returns a shortest path from the root node to the given node.
     *
     * @param {String|Node} node
     * The node to find a shortest path to.
     *
     * @return {Path}
     * A shortest path from the root node to the given node.
     */
    getShortestPathTo(node) {
        node = Graph.toNodeId(node);

        const path = [];
        for (let currentId = node; currentId; currentId = this.parent(currentId)) {
            path.unshift(currentId);
        }
        return new Path(path);
    }

    /**
     * Returns how long the shortest path from the root node to the given node
     * is.
     *
     * @param {String|Node} node
     * The ending node of the path. Passing in an ID is sufficient.
     *
     * @return {Number}
     * The distance between the root node and the given node.
     */
    getDistanceTo(node) {
        node = Graph.toNodeId(node);

        return this.distance(node);
    }
}
