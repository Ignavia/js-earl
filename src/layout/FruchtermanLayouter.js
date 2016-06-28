import {Vec2} from "@ignavia/ella";

import RandomLayouter from "./RandomLayouter";
import * as utils   from "./utils.js";

/**
 * Layout the graph using the Fruchterman-Reingold layout algorithm.
 */
export default class FruchtermannLayouter {

    /**
     * @param {Object} [obj={}]
     * The options object.
     *
     * @param {Vec2} [obj.pos=new Vec2(0, 0)]
     * The top left corner of the bounding rectangle of the layout.
     *
     * @param {number} [obj.width=1920]
     * The width of the bounding rectangle of the layout.
     *
     * @param {number} [obj.height=1080]
     * The height of the bounding rectangle of the layout.
     *
     * @param {number} [obj.idealDistanceCoef=1]
     * The ideal distance between nodes scales linearly with this factor.
     *
     * @param {number} [initialMaxDisplacement]
     * Nodes are only moved this much during the first simulation step. This
     * maximum displacement goes down to 0 in a linear fashion for later
     * simulation steps.
     *
     * @param {number} [obj.nSteps=100]
     * The number of simulation steps.
     */
    constructor ({
        pos                    = new Vec2(0, 0),
        width                  = 1920,
        height                 = 1080,
        idealDistanceCoef      = 1,
        initialMaxDisplacement = width / 10,
        nSteps                 = 50,
    } = {}) {

        /**
         * Creates the initial random layout.
         *
         * @type {RandomLayouter}
         * @private
         */
        this.randomLayouter = new RandomLayouter({ pos, width, height, });

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

        /**
         * The area of the bounding rectangle.
         *
         * @type {number}
         * @private
         */
        this.area = width * height;

        /**
         * The ideal distance between nodes scales linearly with this factor.
         *
         * @type {number}
         * @private
         */
        this.idealDistanceCoef = idealDistanceCoef;

        /**
         * Nodes are only moved this much during the first simulation step. This
         * maximum displacement goes down to 0 in a linear fashion for later
         * simulation steps.
         *
         * @type {Number}
         * @private
         */
        this.initialMaxDisplacement = initialMaxDisplacement;

        /**
         * The number of simulation steps.
         *
         * @type {number}
         * @private
         */
        this.nSteps = nSteps;
    }

    /**
     * Computes the ideal distance between nodes for the given graph.
     *
     * @param {Graph} graph
     * The graph to layout.
     *
     * @return {number}
     * A proposed distance between nodes.
     *
     * @private
     */
    computeIdealDistance(graph) {
        return this.idealDistanceCoef * Math.sqrt(this.area / graph.getNumberOfNodes());
    }

    /**
     * Calculates the the attractive force between two adjacent nodes.
     *
     * @param {Vec2} uPos
     * The position of the first node.
     *
     * @param {Vec2} vPos
     * The position of the second node.
     *
     * @return {Vec2}
     * The force vector.
     *
     * @private
     */
    computeAttractiveForce(uPos, vPos, idealDistance) {
        const {distance, direction} = utils.computeConnection(uPos, vPos);
        console.log("att", distance, direction)
        const forceMagnitude = distance**2 / idealDistance;
        return direction.mul(forceMagnitude);
    }

    /**
     * Calculates the the repulsive force between two non-adjacent nodes.
     *
     * @param {Vec2} uPos
     * The position of the first node.
     *
     * @param {Vec2} vPos
     * The position of the second node.
     *
     * @return {Vec2}
     * The force vector.
     *
     * @private
     */
    computeRepulsiveForce(uPos, vPos, idealDistance) {
        let {distance, direction} = utils.computeConnection(uPos, vPos);
        console.log("rep", distance, direction)
        const forceMagnitude      = -(idealDistance**2) / distance;
        return direction.mul(forceMagnitude);
    }

    /**
     * Computes the maximum displacement that should occur in the given
     * simulation step.
     *
     * @param {number} step
     * The simulation step.
     *
     * @return {number}
     * The maximum displacement.
     *
     * @private
     */
    computeMaxDisplacement(step) {
        return this.initialMaxDisplacement * (1 - step / this.nSteps);
    }

    /**
     * Calculates the force on the given node given a layout.
     *
     * @param {Graph} graph
     * The graph to layout.
     *
     * @param {Map} layout
     * The current layout of the graph.
     *
     * @param {number} idealDistance
     * How far the nodes should ideally be apart.
     *
     * @param {Node} u
     * The node to calculate the force for.
     *
     * @return {Vec2}
     * The force on the given node.
     *
     * @private
     */
    computeForceForNode(graph, layout, idealDistance, u) {
        let result = new Vec2(0, 0); // TODO make builder?
        const uPos = layout.getPosition(u);

        for (let v of graph.iterNodes()) {
            if (u !== v) {
                const vPos          = layout.getPosition(v);
                const repulsive     = this.computeRepulsiveForce(uPos, vPos, idealDistance);
                const nEdgesBetween = u.getNumberOfEdgesBetween(v, "out");
                const attractive    = this.computeAttractiveForce(uPos, vPos, idealDistance);
                console.log("force on", v.id, repulsive, nEdgesBetween, attractive);
                result = result.add(repulsive).add(attractive.mul(nEdgesBetween));
            }
        }

        return result;
    }

    /**
     * Calculates the forces on the nodes given the current layout.
     *
     * @param {Graph} graph
     * The graph to layout.
     *
     * @param {Map} layout
     * The current layout of the graph.
     *
     * @param {number} idealDistance
     * How far the nodes should ideally be apart.
     *
     * @return {Map}
     * The force on the nodes.
     *
     * @private
     */
    computeForces(graph, layout, idealDistance) {
        const result = new Map();

        for (let u of graph.iterNodes()) {
            const force = this.computeForceForNode(
                graph, layout, idealDistance, u
            );
            result.set(u.id, force);
        }

        return result;
    }

    /**
     * Moves the nodes according to the forces calculated in a simulation step.
     *
     * @param {Map} layout
     * The current layout of the graph.
     *
     * @param {Map} forces
     * The calculated forces.
     *
     * @param {number} maxDisplacement
     * The maximum distance to move a node.
     *
     * @private
     */
    adjustLayout(layout, forces, maxDisplacement) {
        for (let [id, force] of forces) {
            const displacement = this.limitDisplacement(force, maxDisplacement);
            const oldPos = layout.getPosition(id);
            const newPos = oldPos.add(displacement);
            layout.moveNodeTo(id, this.clipToFrame(newPos));
        }
    }

    /**
     * Limits the displacement distance to the maximum displacement in the
     * current simulation step.
     *
     * @param {Vec2} displacement
     * The suggested displacement
     *
     * @param {number} maxDisplacement
     * The maximum displacement distance.
     *
     * @return {Vec2}
     * The new displacement.
     *
     * @private
     */
    limitDisplacement(displacement, maxDisplacement) {
        const distance  = Math.min(maxDisplacement, displacement.length());
        const direction = displacement.normalize();
        return direction.mul(distance);
    }

    /**
     * Makes sure the given position is within the bounding rectangle.
     *
     * @param {Vec2} pos
     * The suggested position.
     *
     * @return {Vec2}
     * The clipped position.
     *
     * @private
     */
    clipToFrame(pos) {
        return new Vec2(
        	Math.max(this.min.x, Math.min(pos.x, this.max.x)),
        	Math.max(this.min.y, Math.min(pos.y, this.max.y))
        );
    }

    /**
     * Layouts the graph using the Fruchterman-Reingold layout algorithm.
     *
     * @param {Graph} graph
     * The graph to layout.
     *
     * @param {Layout} [layout]
     * The previous layout. If none is provided, a random layout is generated.
     *
     * @return {Layout}
     * The new layout.
     */
    layout(graph, layout = this.randomLayouter.layout(graph)) {
        const idealDistance = this.computeIdealDistance(graph);
console.log("ideal", idealDistance)
        for (let i = 0; i < this.nSteps; i++) {
            const forces          = this.computeForces(graph, layout, idealDistance); console.log(forces)
            const maxDisplacement = this.computeMaxDisplacement(i);console.log("maxDisp", i, maxDisplacement);
            this.adjustLayout(layout, forces, maxDisplacement);
        }
for (let [k, v] of layout) {console.log("layout", k, v)}
        return layout;
    }
}
