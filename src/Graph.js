import {EventManager, extensibleExtendedMixin, IDGenerator, observableExtendedMixin} from "@ignavia/util";

import Node             from "./Node.js";
import Edge             from "./Edge.js";
import BreadthFirstTree from "./BreadthFirstTree.js";

/**
 * A graph data structure.
 *
 * @implements {Observable}
 * @implements {Extensible}
 */
export default class Graph {

    /**
     * Turns a plain JSON object back to a graph object.
     *
     * @param {Object} json
     * The plain object to convert.
     *
     * @return {Graph}
     * The resulting graph object.
     */
    static fromJSON(json) {
        return new Graph({
            nodes: json.nodes.map(obj => Node.fromJSON(obj)),
            edges: json.edges.map(obj => Edge.fromJSON(obj)),
            id:    json.id
        });
    }

    /**
     * A helper function to turn a node or its ID into an ID.
     *
     * @param {String|Node} node
     * The node or its ID.
     *
     * @return {String}
     * The requested ID.
     */
    static toNodeId(node) {
        if (typeof node === "string") {
            return node;
        } else if (node instanceof Node) {
            return node.id;
        }
    }

    /**
     * A helper function to turn an edge or its ID into an ID.
     *
     * @param {String|Edge} edge
     * The edge or its ID.
     *
     * @return {String}
     * The requested ID.
     */
    static toEdgeId(edge) {
        if (typeof edge === "string") {
            return edge;
        } else if (edge instanceof Edge) {
            return edge.id;
        }
    }

    /**
     * A helper function for other functions that can take a single node ID, an
     * Iterable for node IDs, a single node or an Iterable for nodes and returns
     * an iterable object.
     *
     * @param {String|Iterator<String>|Node|Iterator<String>} nodes
     * The parameter to normalize.
     *
     * @return {Iterator<String>|Iterator<Node>}
     * The normalized parameter.
     */
    static makeNodesIterable(nodes) {
        if (typeof nodes === "string" || nodes instanceof Node) {
            return [nodes];
        }
        return nodes;
    }

    /**
     * A helper function for other functions that can take a single edge ID, an
     * Iterable for edge IDs, a single edge or an Iterable for edges and returns
     * an iterable object.
     *
     * @param {String|Iterator<String>|Edge|Iterator<String>} edges
     * The parameter to normalize.
     *
     * @return {Iterator<String>|Iterator<Edge>}
     * The normalized parameter.
     */
    static makeEdgesIterable(edges) {
        if (typeof edges === "string" || edges instanceof Edge) {
            return [edges];
        }
        return edges;
    }

    /**
     * @param {Object} obj
     * The options object.
     *
     * @param {Iterable} [obj.nodes=[]]
     * The nodes to add to the graph initially.
     *
     * @param {Iterable} [obj.edges=[]]
     * The edges to add to the graph initially.
     *
     * @param {String} [id]
     * The ID of this graph.
     */
    constructor({ nodes = [], edges = [], id } = {}) {
        Graph.idGenerator.avoid(id);

        /**
         * The ID of this graph.
         *
         * @type {String}
         */
        this.id = id || Graph.idGenerator.next();

        /**
         * Contains all the nodes of the graph.
         *
         * @type {Map<String, Node>}
         * @private
         */
        this.nodes = new Map();

        /**
         * Contains all the edges of the graph.
         *
         * @type {Map<String, Edge>}
         * @private
         */
        this.edges = new Map();

        /**
         * Handles listeners.
         *
         * @type {EventManager}
         */
        this.eventManager = new EventManager();

        // Add initial nodes and edges
        this.addNodes(...nodes);
        this.addEdges(...edges);
    }

    /**
     * Adds the given nodes to the graph model.
     *
     * @param {...Node} nodeObjs
     * The nodes to add.
     *
     * @return {Graph}
     * This graph to make the method chainable.
     *
     * @emits {Event}
     * The type property is set to "addNodes", the source is this graph and the
     * data is an array containing the inserted nodes.
     */
    addNodes(...nodeObjs) {

        // Add nodes
        for (let nodeObj of nodeObjs) {
            nodeObj.graph = this;
            this.nodes.set(nodeObj.id, nodeObj);
        }

        // Notify listeners
        if (nodeObjs.length > 0) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "addNodes",
                data:   nodeObjs
            }));
        }

        return this;
    }

    /**
     * Adds the given edges to the graph model. If the graph does not contain
     * either the source and the target node, they are created and added to the
     * graph.
     *
     * @param {...Edge} edgeObjs
     * The edges to add.
     *
     * @return {Graph}
     * This graph to make the method chainable.
     *
     * @emits {Event}
     * The type property is set to "addEdges", the source is this graph and the
     * data is an array with the inserted edges.
     */
    addEdges(...edgeObjs) {

        // Add edges
        for (let edgeObj of edgeObjs) {
            let sourceObj = this.getNodeById(edgeObj.sourceId);
            let targetObj = this.getNodeById(edgeObj.targetId);

            if (!sourceObj) {
                sourceObj = new Node(edgeObj.sourceId);
                this.addNodes(sourceObj);
            }
            if (!targetObj) {
                targetObj = new Node(edgeObj.targetId);
                this.addNodes(targetObj);
            }

            // Update edge data
            edgeObj.graph = this;
            this.edges.set(edgeObj.id, edgeObj);

            // Update incident nodes
            sourceObj.addOutgoingEdge(edgeObj);
            targetObj.addIncomingEdge(edgeObj);
        }

        // Notify listeners
        if (edgeObjs.length > 0) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:  "addEdges",
                data:  edgeObjs
            }));
        }

        return this;
    }

    /**
     * Removes the given nodes and all incident edges.
     *
     * @param {...String|...Node} nodes
     * The nodes to remove. Passing in IDs is enough.
     *
     * @return {Object}
     * An object of all deleted nodes and edges.
     *
     * @emits {Event}
     * The type property is set to "removeNodes", the source is this graph and
     * the data is another object. This data object has a property nodes which
     * is an array containing the deleted nodes and another property edges doing
     * the same for the edges.
     */
    removeNodes(...nodes) {
        const deleted = {
            nodes: [],
            edges: []
        };

        for (let node of nodes) {
            const nodeObj = this.toNodeObj(node);
            if (!nodeObj) {
                continue;
            }

            // Remove incident edges
            const deletedEdges = this.removeEdges(...nodeObj.iterIncidentEdges());
            Array.prototype.push.apply(deleted.edges, deletedEdges);

            // Update node data
            this.nodes.delete(nodeObj.id);
            deleted.nodes.push(nodeObj);
        }

        // Notify listeners
        if (deleted.nodes.length > 0) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "removeNodes",
                data:   deleted.nodes
            }));
        }

        return deleted;
    }

    /**
     * Removes the given edges.
     *
     * @param {...String|...Edge} edges
     * The edges to remove. Passing in IDs is enough.
     *
     * @return {Edge[]}
     * An array of all deleted edges.
     *
     * @emits {Event}
     * The type property is set to "removeEdges", the source is this graph and
     * the data is an array containing all deleted nodes.
     */
    removeEdges(...edges) {
        edges = Graph.makeEdgesIterable(edges);

        const deleted = [];

        // Remove edges
        for (let edge of edges) {
            const edgeObj = this.toEdgeObj(edge);
            if (!edgeObj) {
                continue;
            }

            // Update edge data
            this.edges.delete(edgeObj.id);
            deleted.push(edgeObj);

            // Update incident nodes
            this.nodes.get(edgeObj.sourceId).removeOutgoingEdge(edgeObj);
            this.nodes.get(edgeObj.targetId).removeIncomingEdge(edgeObj);
        }

        // Notify listeners
        if (deleted.length > 0) {
            this.fireEvent(EventManager.makeEvent({
                source: this,
                type:   "removeEdges",
                data:   deleted
            }));
        }

        return deleted;
    }

    /**
     * Returns the node with the given ID.
     *
     * @param {String} nodeId
     * The ID of the node.
     *
     * @return {Node}
     * The node with the given ID.
     */
    getNodeById(nodeId) {
        return this.nodes.get(nodeId);
    }

    /**
     * Returns the edge with the given ID.
     *
     * @param {String} edgeId
     * The ID of the edge.
     *
     * @return {Edge}
     * The edge with the given ID.
     */
    getEdgeById(edgeId) {
        return this.edges.get(edgeId);
    }

    /**
     * Returns the number of nodes in the graph.
     *
     * @return {Number}
     * The number of nodes.
     */
    getNumberOfNodes() {
        return this.nodes.size;
    }

    /**
     * Returns the number of edges in the graph.
     *
     * @return {Number}
     * The number of edges.
     */
    getNumberOfEdges() {
        return this.edges.size;
    }

    /**
     * An Iterable for the node IDs in this graph.
     */
    * iterNodeIds() {
        yield* this.nodes.keys();
    }

    /**
     * An Iterable for the edge IDs in this graph.
     */
    * iterEdgeIds() {
        yield* this.edges.keys();
    }

    /**
     * Iterates over the nodes in the graph. If the nodes parameter is specified
     * only those nodes are considered. Furthermore if a filter function is
     * supplied only nodes that pass the test are included. It is also possible
     * to apply a function to a node and yield the result instead.
     *
     * @param {Object} [options={}]
     * Used for various options.
     *
     * @param {Function} [options.filter=()=>true]
     * The filter function to apply. It gets a node as the first parameter
     * and this graph as the second.
     *
     * @param {Function} [options.map=(n)=>n]
     * The function to use for mapping. It gets a node as the first parameter
     * and this graph as the second.
     *
     * @param {String|Iterator<String>|Node|Iterator<Node>} [options.nodes]
     * Restricts the nodes to iterate over. Passing in IDs is enough.
     */
    * iterNodes({filter = ()=>true, map = (n)=>n, nodes = this.nodes.values()} = {}) {
        nodes = Graph.makeNodesIterable(nodes);

        for (let node of nodes) {
            const nodeObj = this.toNodeObj(node);
            if (nodeObj && filter(nodeObj, this)) {
                yield map(nodeObj, this);
            }
        }
    }

    /**
     * Iterates over the edges in the graph. If the edges parameter is specified
     * only those edges are considered. Furthermore if a filter function is
     * supplied only edges that pass the test are included. It is also possible
     * to apply a function to an edge and yield the result instead.
     *
     * @param {Object} [options={}]
     * Used for various options.
     *
     * @param {Function} [options.filter=()=>true]
     * The filter function to apply. It gets an edge as the first parameter
     * and this graph as the second.
     *
     * @param {Function} [options.map=(e)=>e]
     * The function to use for mapping. It gets a node as the first parameter
     * and this graph as the second.
     *
     * @param {String|Iterator<String>|Edge|Iterator<Edge>} [options.edges]
     * Restricts the edges to iterate over. Specifying IDs is sufficient.
     */
    * iterEdges({filter = ()=>true, map = (e)=>e, edges = this.edges.values()} = {}) {
        edges = Graph.makeEdgesIterable(edges);

        for (let edge of edges) {
            const edgeObj = this.toEdgeObj(edge);
            if (edgeObj && filter(edgeObj, this)) {
                yield map(edgeObj, this);
            }
        }
    }

    /**
     * Creates a new graph containing all specified nodes and all edges that
     * start and end at nodes from this set.
     *
     * @param {...String|...Node} nodes
     * The nodes to include in the result graph. Passing in IDs is enough.
     *
     * @return {Graph}
     * The resulting graph.
     */
    generateMaximumSubgraphWith(...nodes) {
        const result    = new Graph();
        result.parentId = this.id;

        // Maps from node IDs in this graph to IDs in the new graph.
        const idMap = new Map();

        // Add nodes
        for (let node of nodes) {
            const nodeObj = this.toNodeObj(node);
            if (nodeObj) {
                const newNodeObj    = new Node();
                newNodeObj.parentId = nodeObj.id;
                result.addNodes(newNodeObj);
                idMap.set(nodeObj.id, newNodeObj.id);
            } // TODO needs some mapping from old to new nodes now
        }

        // Add edges
        for (let edgeObj of this.iterEdges()) {
            const newSourceId = idMap.get(edgeObj.sourceId),
                  newTargetId = idMap.get(edgeObj.targetId);
            if (newSourceId && newTargetId) {
                const newEdgeObj = new Edge(
                    newSourceId,
                    newTargetId
                );
                newEdgeObj.parentId = edgeObj.id;
                result.addEdges(newEdgeObj);
            }
        }

        return result;
    }

    /**
     * Creates a graph containing all specified edges and the nodes they start
     * and end at.
     *
     * @param {...String|...Edge} edges
     * The edges to include in the result graph. Passing in IDs is sufficient.
     *
     * @return {Graph}
     * The resulting graph.
     */
    generateMinimumSubgraphWith(...edges) {
        const result    = new Graph();
        result.parentId = this.id;

        // Maps from node IDs in this graph to IDs in the new graph.
        const idMap = new Map();

        for (let edge of edges) {
            const edgeObj = this.toEdgeObj(edge);
            if (!edgeObj) {
                continue;
            }

            const sourceId = edgeObj.sourceId;
            const targetId = edgeObj.targetId;

            // Add source node
            if (!idMap.has(sourceId)) {
                const source  = this.getNodeById(sourceId);
                const newNode = new Node();
                newNode.parentId = source.id;
                result.addNodes(newNode);
                idMap.set(sourceId, newNode.id);
            }

            // Add target node
            if (!idMap.has(targetId)) {
                const target     = this.getNodeById(targetId);
                const newNode    = new Node();
                newNode.parentId = target.id;
                result.addNodes(newNode);
                idMap.set(targetId, newNode.id);
            }

            // Add edge
            const newEdge = new Edge(
                idMap.get(sourceId),
                idMap.get(targetId)
            );
            newEdge.parentId = edgeObj.id;
            result.addEdges(newEdge);
        }

        return result;
    }

    /**
     * Yields the nodes in the graph in DFS order starting at the root.
     *
     * @param {String|Node} root
     * The starting node.
     *
     * @param {String} [direction="all"]
     * * "all": The direction of edges is disregarded.
     * * "out": Only edges starting at a node are followed.
     * * "inc": Only edges ending at this node are followed.
     */
    * iterDFSVisit(root, direction) {
        root      = this.toNodeObj(root);
        direction = direction || "all"; // TODO change to default parameter (babel bug)

        const stack   = [root];
        const visited = new Set();

        while (stack.length > 0) {
            const currentObj = stack.pop();

            if (!visited.has(currentObj.id)) {
                yield currentObj;
                for (let neighborId of currentObj.iterAdjacentNodes(direction)) {
                    const neighborObj = this.getNodeById(neighborId);
                    stack.push(neighborObj);
                }
                visited.add(currentObj.id);
            }
        }
    }

    /**
     * Yields the nodes in the graph in BFS order starting at the root.
     *
     * @param {String|Node} root
     * The starting node.
     *
     * @param {String} [direction="all"]
     * * "all": The direction of edges is disregarded.
     * * "out": Only edges starting at a node are followed.
     * * "inc": Only edges ending at this node are followed.
     */
    * iterBFSVisit(root, direction) {
        root = this.toNodeObj(root);
        direction = direction || "all"; // TODO change to default parameter (babel bug)

        const queue   = [root];
        const visited = new Set();

        visited.add(root.id);

        while (queue.length > 0) {
            const currentObj = queue.shift();
            yield currentObj;

            for (let neighborId of currentObj.iterAdjacentNodes(direction)) {
                if (!visited.has(neighborId)) {
                    const neighborObj = this.getNodeById(neighborId);
                    queue.push(neighborObj);
                    visited.add(neighborId);
                }
            }
        }
    }

    /**
     * Computes a breadth first tree starting at the given node.
     *
     * @param {String|Node} root
     * The node to start the algorithm at.
     *
     * @param {String} [direction="all"]
     * * "all": The direction of edges is disregarded.
     * * "out": Only edges starting at a node are followed.
     * * "inc": Only edges ending at this node are followed.
     *
     * @return {BreadthFirstTree}
     * The computed breadth first tree.
     */
    computeBreadthFirstTree(root, direction = "all") {
        root = this.toNodeObj(root);

        const queue  = [root];
        const result = new Map();

        result.set(root.id, {
            parentId: undefined,
            distance: 0
        });

        while (queue.length > 0) {
            const currentObj = queue.shift();
            for (let neighborId of currentObj.iterAdjacentNodes(direction)) {
                if (!result.has(neighborId)) {
                    const neighborObj = this.getNodeById(neighborId);
                    queue.push(neighborObj);
                    result.set(neighborId, {
                        parentId: currentObj.id,
                        distance: result.get(currentObj.id).distance + 1
                    });
                }
            }
        }

        return new BreadthFirstTree(
            root,
            nodeId => result.has(nodeId) ? result.get(nodeId).parentId : undefined,
            nodeId => result.has(nodeId) ? result.get(nodeId).distance : undefined
        );
    }

    /**
     * A helper function to turn a node or its ID into a node object.
     *
     * @param {String|Node} node
     * The node to get or its ID.
     *
     * @return {Node}
     * The requested node.
     */
    toNodeObj(node) {
        if (typeof node === "string") {
            return this.getNodeById(node);
        } else if (node instanceof Node) {
            return this.getNodeById(node.id);
        }
    }

    /**
     * A helper function to turn an edge or its ID into a edge object.
     *
     * @param {String|Edge} edge
     * The edge to get or its ID.
     *
     * @return {Edge}
     * The requested edge.
     */
    toEdgeObj(edge) {
        if (typeof edge === "string") {
            return this.getEdgeById(edge);
        } else if (edge instanceof Edge) {
            return this.getEdgeById(edge.id);
        }
    }

    /**
     * Returns a textual representation of this graph.
     *
     * @return {String}
     * A textual representation of this graph.
     *
     * @override
     */
    toString() {
        return this.id;
    }

    /**
     * Returns a JSON representation of this graph.
     *
     * @return {Object}
     * A JSON representation of this graph.
     */
    toJSON() {
        return {
            nodes: [...this.nodes.values()].map(n => n.toJSON()),
            edges: [...this.edges.values()].map(e => e.toJSON()),
            id:    this.id
        };
    }
}

/**
 * Provides IDs.
 *
 * @type {IDGenerator}
 * @private
 */
Graph.idGenerator = new IDGenerator("g");

// Make graphs observable
Object.assign(Graph.prototype, observableExtendedMixin);

// Make graphs extensible
Object.assign(Graph.prototype, extensibleExtendedMixin);
