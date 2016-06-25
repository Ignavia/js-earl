import _ from "lodash";

import {Vec2} from "@ignavia/ella";

import Layout from "./Layout.js";

/**
 * Layouts nodes randomly within a bounding rectangle.
 */
export default class RandomLayout {

    /**
     * @param {Object} obj
     * The options object.
     *
     * @param {Vec2} [obj.pos=new Vec2(0, 0)]
     * The top left corner of the bounding rectangle.
     *
     * @param {number} [obj.width=1920]
     * The width of the bounding rectangle.
     *
     * @param {number} [obj.height=1080]
     * The height of the bounding rectangle.
     */
    constructor({
        pos    = new Vec2(0, 0),
        width  = 1920,
        height = 1080,
    } = {}) {

        /**
         * The top left corner of the bounding rectangle.
         *
         * @type {Vec2}
         * @private
         */
        this.min = pos;

        /**
         * The botton right corner of the bounding rectangle.
         *
         * @type {Vec2}
         * @private
         */
        this.max = new Vec2(
            pos.x + width,
            pos.y + height
        );
    }

    /**
     * Moves the nodes in the given graph to a random position and returns the
     * layout. The range of the x- and y-values can be restricted.
     *
     * @param {Graph} graph
     * The graph to layout.
     *
     * @return {Layout}
     * The resulting layout.
     */
    layout(graph) {
        const result = new Layout();
        for (let node of graph.iterNodes()) {
            result.moveNodeTo(node.id, new Vec2(
                _.random(this.min.x, this.max.x, true),
                _.random(this.min.y, this.max.y, true)
            ));
        }
        return result;
    }
}
