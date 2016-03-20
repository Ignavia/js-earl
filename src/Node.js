import "babel-regenerator-runtime"; // TODO remove when not needed anymore (babel bug)

import {IDGenerator} from "@ignavia/util";

import Graph from "./Graph.js";

/**
 * A node in a graph.
 *
 * @implements {Observable}
 */
export default class Node {

    /**
     *
     */
    constructor() {

        /**
         * The ID of this node.
         *
         * @type {String}
         */
        this.id = Node.idGenerator.next();

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
         * @property {Map<String, Set<String>} _adjacencyLists.all
         * Maps from IDs of all adjacent nodes to the IDs of the edges between
         * the nodes.
         *
         * @property {Map<String, Set<String>} _adjacencyLists.out
         * Maps from the IDs of all nodes that are the target node of at least
         * one edge starting at this node to the corresponding edge IDs.
         *
         * @property {Map<String, Set<String>} _adjacencyLists.inc
         * Maps from the IDs of all nodes that are the source node of at least
         * one edge ending at this node to the corresponding edge IDs.
         *
         * @private
         */
        this.adjacencyLists = {
            all: new Map(),
            out: new Map(),
            inc: new Map()
        };

        /**
         * Stores information about incident edges.
         *
         * @type {Object}
         *
         * @property {Set<String>} _incidenceLists.all
         * The IDs of all incident edges.
         *
         * @property {Set<String>} _incidenceLists.out
         * The IDs of all outgoing edges.
         *
         * @property {Set<String>} _incidenceLists.inc
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
    * iterAdjacentNodes(direction) {
        direction = direction || "all"; // TODO change to default parameter (babel bug)

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
    * iterEdgesBetween(node, direction) {
        node      = Graph.toNodeId(node);
        direction = direction || "all"; // TODO change to default parameter (babel bug)

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
        return adjacencyList.has(node) &&
               adjacencyList.get(node).has(edge);
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
    * iterIncidentEdges(direction) {
        direction = direction || "all"; // TODO change to default parameter (babel bug)

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

        // Update incidence lists
        this.incidenceLists.all.add(edgeId);
        this.incidenceLists.out.add(edgeId);

        // Update adjacency lists
        const adjacencyAll = this.adjacencyLists.all;
        const adjacencyOut = this.adjacencyLists.out;
        const targetId     = edgeObj.targetId;

        if (!adjacencyAll.has(targetId)) {
            adjacencyAll.set(targetId, new Set());
        }
        adjacencyAll.get(targetId).add(edgeId);

        if (!adjacencyOut.has(targetId)) {
            adjacencyOut.set(targetId, new Set());
        }
        adjacencyOut.get(targetId).add(edgeId);
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

        // Update incidence lists
        this.incidenceLists.all.add(edgeId);
        this.incidenceLists.inc.add(edgeId);

        // Update adjacency lists
        const adjacencyAll = this.adjacencyLists.all;
        const adjacencyInc = this.adjacencyLists.inc;
        const sourceId     = edgeObj.sourceId;

        if (!adjacencyAll.has(sourceId)) {
            adjacencyAll.set(sourceId, new Set());
        }
        adjacencyAll.get(sourceId).add(edgeId);

        if (!adjacencyInc.has(sourceId)) {
            adjacencyInc.set(sourceId, new Set());
        }
        adjacencyInc.get(sourceId).add(edgeId);
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

        // Update incidence lists
        this.incidenceLists.all.delete(edgeId);
        this.incidenceLists.out.delete(edgeId);

        // Update adjacency lists
        const adjacencyAll      = this.adjacencyLists.all;
        const adjacencyOut      = this.adjacencyLists.out;
        const targetId          = edgeObj.targetId;
        const adjacencyAllEdges = adjacencyAll.get(targetId);
        const adjacencyOutEdges = adjacencyOut.get(targetId);

        adjacencyAllEdges.delete(edgeId);
        if (adjacencyAllEdges.size === 0) {
            adjacencyAll.delete(targetId);
        }

        adjacencyOutEdges.delete(edgeId);
        if (adjacencyOutEdges.size === 0) {
            adjacencyOut.delete(targetId);
        }
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

        // Update incidence lists
        this.incidenceLists.all.delete(edgeId);
        this.incidenceLists.inc.delete(edgeId);

        // Update adjacency lists
        const adjacencyAll      = this.adjacencyLists.all;
        const adjacencyInc      = this.adjacencyLists.inc;
        const sourceId          = edgeObj.sourceId;
        const adjacencyAllEdges = adjacencyAll.get(sourceId);
        const adjacencyIncEdges = adjacencyInc.get(sourceId);

        adjacencyAllEdges.delete(edgeId);
        if (adjacencyAllEdges.size === 0) {
            adjacencyAll.delete(sourceId);
        }

        adjacencyIncEdges.delete(edgeId);
        if (adjacencyIncEdges.size === 0) {
            adjacencyInc.delete(sourceId);
        }
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
}

/**
 * Provides IDs.
 *
 * @type {IDGenerator}
 * @private
 */
Node.idGenerator = new IDGenerator("n");
