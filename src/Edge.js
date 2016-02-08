import {IDGenerator} from "@ignavia/util";

import Graph from "./Graph.js";

/**
 * An edge in a graph.
 *
 * @implements {Observable}
 */
export default class Edge {

    /**
     * @param {String|Node} source
     * The ID of the source node or the source node itself.
     *
     * @param {String|Node} target
     * The ID of the target node or the target node itself.
     */
    constructor(source, target) {

        /**
         * The ID of the source node.
         *
         * @type {String}
         */
        this.sourceId = Graph.toNodeId(source);

        /**
         * The ID of the target node.
         *
         * @type {String}
         */
        this.targetId = Graph.toNodeId(target);

        /**
         * The ID of this edge.
         *
         * @type {String}
         */
        this.id = Edge.idGenerator.next();

        /**
         * The graph that contains this edge. This property will be set after
         * adding the edge to a graph.
         *
         * @type {Graph}
         */
        this.graph = undefined;
    }

    /**
     * Returns a textual representation of this edge.
     *
     * @return {String}
     * A textual representation of this edge.
     *
     * @override
     */
    toString() {
        return `${this.id}(${this.sourceId}, ${this.targetId})`;
    }
}

/**
 * Provides IDs.
 *
 * @type {IDGenerator}
 * @private
 */
Edge.idGenerator = new IDGenerator("g");
