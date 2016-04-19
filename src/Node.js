import {GumpMap, IDGenerator} from "@ignavia/util";

import Graph from "./Graph.js";

/**
 * A node in a graph.
 */
export default class Node {

    /**
     * Turns a plain JSON object back to a Node object.
     *
     * @param {Object} json
     * The plain object to convert.
     *
     * @return {Node}
     * The resulting node object.
     */
    static fromJSON(json) {
        return new Node(json.id);
    }

    /**
     * @param {String} [id]
     * The ID of this node.
     */
    constructor(id) {
        if (id && /^n[0-9]+$/.test(id)) {
            const [, counter] = id.match(/^n([0-9]+)$/);
            Node.idGenerator.increaseToAtLeast(counter + 1);
        } else {
            id = Node.idGenerator.next();
        }

        /**
         * The ID of this node.
         *
         * @type {String}
         */
        this.id = id;

        /**
         * The graph that contains this node. This property will be set after
         * adding the node to a graph.
         *
         * @type {Graph}
         */
        this.graph = undefined;

        /**
         * Stores information about adjacent nodes.
         *
         * @type {Object}
         *
         * @property {GumpMap} adjacencyLists.all
         * Maps from IDs of all adjacent nodes to the IDs of the edges between
         * the nodes.
         *
         * @property {GumpMap} adjacencyLists.out
         * Maps from the IDs of all nodes that are the target node of at least
         * one edge starting at this node to the corresponding edge IDs.
         *
         * @property {GumpMap} adjacencyLists.inc
         * Maps from the IDs of all nodes that are the source node of at least
         * one edge ending at this node to the corresponding edge IDs.
         *
         * @private
         */
        this.adjacencyLists = {
            all: new GumpMap({autoPurgeEmptyContainers: true}),
            out: new GumpMap({autoPurgeEmptyContainers: true}),
            inc: new GumpMap({autoPurgeEmptyContainers: true})
        };

        /**
         * Stores information about incident edges.
         *
         * @type {Object}
         *
         * @property {Set<String>} incidenceLists.all
         * The IDs of all incident edges.
         *
         * @property {Set<String>} incidenceLists.out
         * The IDs of all outgoing edges.
         *
         * @property {Set<String>} incidenceLists.inc
         * The IDs of all incoming edges.
         *
         * @private
         */
        this.incidenceLists = {
            all: new Set(),
            out: new Set(),
            inc: new Set()
        };
    }

    /**
     * Iterates over the IDs of adjacent nodes. The result depends on the
     * given direction.
     *
     * @param {String} [direction="all"]
     * * "all": All adjacent nodes are considered.
     * * "out": Only nodes that are the target node of at least one edge
     * starting at this node are selected.
     * * "inc": Only nodes that are the source node of at least one edge ending
     * at this node are chosen.
     */
    * iterAdjacentNodes(direction = "all") {
        const adjacencyList = this.adjacencyLists[direction];
        if (!adjacencyList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        yield* adjacencyList.keys();
    }

    /**
     * Returns the number of adjacent nodes. The result depends on the given
     * direction.
     *
     * @param {String} [direction="all"]
     * * "all": All adjacent nodes are considered.
     * * "out": Only nodes that are the target node of at least one edge
     * starting at this node are selected.
     * * "inc": Only nodes that are the source node of at least one edge ending
     * at this node are chosen.
     *
     * @return {Number}
     * The number of adjacent nodes.
     */
    getNumberOfAdjacentNodes(direction = "all") {
        const adjacencyList = this.adjacencyLists[direction];
        if (!adjacencyList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        return adjacencyList.size;
    }

    /**
     * Returns if the given node is adjacent to this one. The result depends on
     * the supplied direction.
     *
     * @param {String|Node} node
     * The node to test for adjacency. Specifying the ID is sufficient.
     *
     * @param {String} [direction="all"]
     * * "all": All adjacent nodes are considered.
     * * "out": Only nodes that are the target node of at least one edge
     * starting at this node are selected.
     * * "inc": Only nodes that are the source node of at least one edge ending
     * at this node are chosen.
     *
     * @return {Boolean}
     * If the given node is adjacent to this one.
     */
    isAdjacentNode(node, direction = "all") {
        node = Graph.toNodeId(node);

        const adjacencyList = this.adjacencyLists[direction];
        if (!adjacencyList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        return adjacencyList.has(node);
    }

    /**
     * Iterates over the IDs of the edges between this node and the given node.
     * The result depends on the direction.
     *
     * @param {String|Node} node
     * The other ending point of the edges. Passing in an ID is enough.
     *
     * @param {String} [direction="all"]
     * * "all": All edges between the two nodes are considered.
     * * "out": Only edges that start at this node and end at the given one are
     * selected.
     * * "inc": Only edges that start at the given node and end at this one are
     * chosen.
     */
    * iterEdgesBetween(node, direction = "all") {
        node = Graph.toNodeId(node);

        const adjacencyList = this.adjacencyLists[direction];
        if (!adjacencyList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        if (adjacencyList.has(node)) {
            yield* adjacencyList.get(node).values();
        }
    }

    /**
     * Returns the number of edges between this node and the given node. The
     * result depends on the direction.
     *
     * @param {String|Node} node
     * The other ending point of the edges. Specifying an ID is enough.
     *
     * @param {String} [direction="all"]
     * * "all": All edges between the two nodes are considered.
     * * "out": Only edges that start at this node and end at the given one are
     * selected.
     * * "inc": Only edges that start at the given node and end at this one are
     * chosen.
     *
     * @return {Number}
     * The number of edges between this node and the given node.
     */
    getNumberOfEdgesBetween(node, direction = "all") {
        node = Graph.toNodeId(node);

        const adjacencyList = this.adjacencyLists[direction];
        if (!adjacencyList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        return adjacencyList.has(node) ? adjacencyList.get(node).size : 0;
    }

    /**
     * Returns if the given edge is incident to this node and the given one. The
     * result depends on the specified direction. Passing in the ID for the node
     * or the edge is enough.
     *
     * @param {String|Node} node
     * The other ending point of the edge. Giving an ID suffices.
     *
     * @param {String|Edge} edge
     * The edge to test. Specifying an ID is enough.
     *
     * @param {String} [direction="all"]
     * * "all": All edges between the two nodes are considered.
     * * "out": Only edges that start at this node and end at the given one are
     * selected.
     * * "inc": Only edges that start at the given node and end at this one are
     * chosen.
     *
     * @return {Boolean}
     * If the given edge is incident to this node and the given one.
     */
    isEdgeBetween(node, edge, direction = "all") {
        node = Graph.toNodeId(node);
        edge = Graph.toEdgeId(edge);

        const adjacencyList = this.adjacencyLists[direction];
        if (!adjacencyList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        return adjacencyList.has(node, edge);
    }

    /**
     * Iterates over the IDs of incident edges. The result depends on the
     * direction.
     *
     * @param {String} [direction="all"]
     * * "all": All incident edges are considered.
     * * "out": Only edges that start at this node are selected.
     * * "inc": Only edges that end at this node are chosen.
     */
    * iterIncidentEdges(direction = "all") {
        const incidenceList = this.incidenceLists[direction];
        if (!incidenceList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        yield* incidenceList.values();
    }

    /**
     * Returns the the degree of this node. This is the number of incident
     * edges. The result depends on the direction.
     *
     * @param {String} [direction="all"]
     * * "all": All incident edges are considered.
     * * "out": Only edges that start at this node are selected (outdegree).
     * * "inc": Only edges that end at this node are chosen (indegree).
     *
     * @return {Number}
     * The number of selected edges.
     */
    getNumberOfIncidentEdges(direction = "all") {
        const incidenceList = this.incidenceLists[direction];
        if (!incidenceList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        return incidenceList.size;
    }

    /**
     * Returns if the given edge is incident to this node. The result depends on
     * the given direction.
     *
     * @param {String|Edge} edge
     * The edge to test for incidency. Specifying the ID is sufficient.
     *
     * @param {String} [direction="all"]
     * * "all": All incident edges are considered.
     * * "out": Only edges that start at this node are selected.
     * * "inc": Only edges that end at this node are chosen.
     *
     * @return {Boolean}
     * If the given edge is incident to this node.
     */
    isIncidentEdge(edge, direction = "all") {
        edge = Graph.toEdgeId(edge);

        const incidenceList = this.incidenceLists[direction];
        if (!incidenceList) {
            throw new Error(`The direction ${direction} is invalid.`);
        }
        return incidenceList.has(edge);
    }

    /**
     * Adds a new outgoing edge.
     *
     * @param {Edge} edgeObj
     * The edge to add.
     *
     * @ignore
     */
    addOutgoingEdge(edgeObj) {
        const edgeId = edgeObj.id;
        const targetId = edgeObj.targetId;

        this.adjacencyLists.all.add(targetId, edgeId);
        this.adjacencyLists.out.add(targetId, edgeId);
        this.incidenceLists.all.add(edgeId);
        this.incidenceLists.out.add(edgeId);
    }

    /**
     * Adds a new incoming edge.
     *
     * @param {Edge} edgeObj
     * The edge to add.
     *
     * @ignore
     */
    addIncomingEdge(edgeObj) {
        const edgeId = edgeObj.id;
        const sourceId = edgeObj.sourceId;

        this.adjacencyLists.all.add(sourceId, edgeId);
        this.adjacencyLists.inc.add(sourceId, edgeId);
        this.incidenceLists.all.add(edgeId);
        this.incidenceLists.inc.add(edgeId);
    }

    /**
     * Removes the given outgoing edge.
     *
     * @param {Edge} edgeObj
     * The edge to remove.
     *
     * @ignore
     */
    removeOutgoingEdge(edgeObj) {
        const edgeId = edgeObj.id;
        const targetId = edgeObj.targetId;

        this.adjacencyLists.all.delete(targetId, edgeId);
        this.adjacencyLists.out.delete(targetId, edgeId);
        this.incidenceLists.all.delete(edgeId);
        this.incidenceLists.out.delete(edgeId);
    }

    /**
     * Removes the given incoming edge.
     *
     * @param {Edge} edgeObj
     * The edge to remove.
     *
     * @ignore
     */
    removeIncomingEdge(edgeObj) {
        const edgeId = edgeObj.id;
        const sourceId = edgeObj.sourceId;

        this.adjacencyLists.all.delete(sourceId, edgeId);
        this.adjacencyLists.inc.delete(sourceId, edgeId);
        this.incidenceLists.all.delete(edgeId);
        this.incidenceLists.inc.delete(edgeId);
    }

    /**
     * Returns a textual representation of this node.
     *
     * @return {String}
     * A textual representation of this node.
     *
     * @override
     */
    toString() {
        return this.id;
    }

    /**
     * Returns a JSON representation of this node.
     *
     * @return {Object}
     * A JSON representation of this node.
     */
    toJSON() {
        return {
            id: this.id
        };
    }
}

/**
 * Provides IDs.
 *
 * @type {IDGenerator}
 * @private
 */
Node.idGenerator = new IDGenerator("n");
