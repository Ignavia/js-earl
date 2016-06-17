import {Vec2} from "@ignavia/ella";

import Graph from "../Graph.js";

/**
 * A graph layout.
 */
export default class {

    /**
     * @param {Iterable} [positions=[]]
     * The positions of the nodes. Each entry has the form [node, position].
     */
    constructor(positions = []) {

        /**
         * Maps from node IDs to positions.
         *
         * @type {Map<String, Vec2Builder>}
         * @private
         */
        this.positions = new Map();

        // Initial positions
        for (let [node, position] of positions) {
            node = Graph.toNodeId(node);
            this.moveNodeTo(node, position);
        }
    }

    /**
     * Returns the position of the given node.
     *
     * @param {String|Node} node
     * The node to get the position for or its ID.
     *
     * @return {Vec2|Vec2Builder}
     * The position of the node.
     */
    getPosition(node) {
        node = Graph.toNodeId(node);
        return this.positions.get(node);
    }

    /**
     * Moves the given node to the new position.
     *
     * @param {String|Node} node
     * The node to move or its ID.
     *
     * @param {Vec2|Vec2Builder} newPosition
     * The new position of the node.
     */
    moveNodeTo(node, newPosition) {
        node = Graph.toNodeId(node);
        this.positions.set(node, newPosition);
    }

    /**
     * Translates the given node by the given vector.
     *
     * @param {String|Node} node
     * The node to move or its ID.
     *
     * @param {Vec2|Vec2Builder} vector
     * The vector to add to the current position.
     */
    moveNodeBy(node, vector) {
        const position = this.getPosition(node);
        this.moveNodeTo(node, position.add(vector));
    }

    /**
     * Translates all positions by the given vector.
     *
     * @param {Vec2|Vec2Builder} vector
     * The vector to add to the positions.
     */
    moveAll(vector) {
        for (let [id, position] of this.positions) {
            this.moveNodeTo(id, position.add(vector));
        }
    }

    /**
     * Stretches the layout from the given center by the given factor.
     *
     * @param {Number} factor
     * The factor by which to stretch the layout.
     *
     * @param {Vec2|Vec2Builder} [center]
     * The point from which to stretch the layout. By default both the x- and
     * y-coordinates are 0.
     */
    scaleAll(factor, center = new Vec2(0, 0)) {
        this.moveAll(center.mul(-1));
        for (let [id, position] of this.positions) {
            this.moveNodeTo(id, position.mul(factor));
        }
        this.moveAll(center);
    }

    /**
     * Rotates the layout around the given center by the given angle.
     *
     * @param {Number} angle
     * The angle by which to rotate the layout.
     *
     * @param {Vec2|Vec2Builder} [center]
     * The point around which to rotate the layout. By default both the x- and
     * y-coordinates are 0.
     */
    rotateAll(angle, center = new Vec2(0, 0)) {
        this.moveAll(center.mul(-1));
        for (let [id, position] of this.positions) {
            this.moveNodeTo(id, position.rotate(angle));
        }
        this.moveAll(center);
    }

    /**
     * Yields all pairs [id, position].
     */
    * [Symbol.iterator]() {
        yield* this.positions;
    }
}