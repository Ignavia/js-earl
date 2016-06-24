import _ from "lodash";

import {Vec2} from "@ignavia/ella";

import Layout from "./Layout.js";

/**
 * Moves the nodes in the given graph to a random position and returns the
 * layout. The range of the x- and y-values can be restricted.
 *
 * @param {Graph} graph
 * The graph to layout.
 *
 * @param {Object} obj
 * The options object.
 *
 * @param {Vec2} [pos=new Vec2(0, 0)]
 * The top left corner of the bounding rectangle.
 *
 * @param {number} [width=1920]
 * The width of the bounding rectangle.
 *
 * @param {number} [height=1080]
 * The height of the bounding rectangle.
 *
 * @return {Layout}
 * The resulting layout.
 */
export default function (graph, {pos = new Vec2(0, 0), width = 1920, height = 1080} = {}) {
    const result = new Layout();
    for (let node of graph.iterNodes()) {
        result.moveNodeTo(node.id, new Vec2(
            _.random(pos.x, pos.x + width,  true),
            _.random(pos.y, pos.y + height, true)
        ));
    }
    return result;
}
