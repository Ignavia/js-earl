import Graph from "./Graph.js";

/**
 * A path through a graph.
 */
export default class Path {

    /**
     * Turns a plain JSON object back to a Path object.
     *
     * @param {Object} json
     * The plain object to convert.
     *
     * @return {Path}
     * The resulting path object.
     */
    static fromJSON(json) {
        return new Path(...json.nodes);
    }

    /**
     * @param {...String|...Node} nodes
     * The nodes visited by this path in order. Specifying IDs is enough.
     */
    constructor(...nodes) {

        /**
         * If this path is a cycle. This means the first and last node are the
         * same and the length of the path is at least 1.
         *
         * @type {Boolean}
         */
        this.isCycle = true;

        /**
         * If the path is a simple cycle. This means it is a cycle and no node
         * except the first and last node is visited twice.
         *
         * @type {Boolean}
         */
        this.isSimpleCycle = true;

        /**
         * If the path is simple. This means no node is visited twice.
         *
         * @type {Boolean}
         */
        this.isSimplePath = true;

        /**
         * The IDs of the nodes visited by this path in order.
         *
         * @type {String[]}
         * @private
         */
        this.nodeIds = [];

        /**
         * Counts how often a node is visited by this path.
         *
         * @type {Map<String, Number>}
         * @private
         */
        this.visitCounter = new Map();

        // Normalize path
        for (let node of nodes) {
            const nodeId = Graph.toNodeId(node);
            this.nodeIds.push(nodeId);
        }

        // Analyze path
        for (let i = 0, len = this.nodeIds.length; i < len; i++) {
            const nodeId = this.nodeIds[i];

            if (this.visitCounter.has(nodeId)) {
                const c = this.visitCounter.get(nodeId);
                this.visitCounter.set(nodeId, c + 1);
                this.isSimplePath = false;
                if (i < len - 1) {
                    this.isSimpleCycle = false;
                }
            } else {
                this.visitCounter.set(nodeId, 1);
            }
        }

        this.isCycle = this.nodeIds.length > 1 &&
                       this.nodeIds[0] === this.nodeIds.slice(-1)[0];
        this.isSimpleCycle = this.isSimpleCycle && this.isCycle;
    }

    /**
     * Returns the length of this path. The length is one lower than the number
     * of nodes on the path.
     *
     * @return {Number}
     * The length of the path.
     */
    getLength() {
        return this.nodeIds.length - 1;
    }

    /**
     * Returns how often the given node is visited by the path.
     *
     * @param {String|Node} node
     * The node to test.
     *
     * @return {Number}
     * How often the node is visited.
     */
    getNumberOfVisits(node) {
        node = Graph.toNodeId(node);
        return this.visitCounter.has(node) ? this.visitCounter.get(node) : 0;
    }

    /**
     * Tests if the given node lies on this path.
     *
     * @param {String|Node} node
     * The node to test. Specifying an ID is enough.
     *
     * @return {Boolean}
     * If the given node lies on this path.
     */
    isVisited(node) {
        node = Graph.toNodeId(node);
        return this.visitCounter.has(node);
    }

    /**
     * Returns an array with the IDs of the nodes on the path in order.
     *
     * @return {String[]}
     * The IDs of the nodes on the path.
     */
    toArray() {
        return this.nodeIds;
    }

    /**
     * Returns a textual representation of this path.
     *
     * @return {String}
     * A textual representation of this path.
     */
    toString() {
        let result = "";

        for (let i = 0, len = this.nodeIds.length; i < len; i++) {
            result += this.nodeIds[i];
            if (i < len - 1) {
                result += " ~> ";
            }
        }

        return result;
    }

    /**
     * Returns a JSON representation of this path.
     *
     * @return {Object}
     * A JSON representation of this path.
     */
    toJSON() {
        return {
            nodes: this.toArray()
        };
    }
}
