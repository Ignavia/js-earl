import _ from "lodash";

import {Vec2} from "@ignavia/ella";

import Layout from "./LayoutClass.js";

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
 * @param {Number} [obj.minX=0]
 * The minimum x-coordinate.
 *
 * @param {Number} [obj.maxX=1]
 * The maximum x-coordinate.
 *
 * @param {Number} [obj.minY=0]
 * The minimum y-coordinate.
 *
 * @param {Number} [obj.maxY=1]
 * The maximum y-coordinate.
 *
 * @return {Map}
 * The resulting layout. This is a map from node IDs to their position
 * represented by Vec2 object.
 */
export default function (graph, {minX = 0, maxX = 1, minY = 0, maxY = 1} = {}) {
    const result = new Layout();
    for (let node of graph.iterNodes()) {
        result.moveNodeTo(node.id, new Vec2(
            _.random(minX, maxX),
            _.random(minY, maxY)
        ));
    }
    return result;
}
