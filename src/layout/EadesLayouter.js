import {Vec2, Vec2Builder} from "@ignavia/ella";

import RandomLayouter from "./RandomLayouter.js";
import * as utils     from "./utils.js";

/**
 * Layouts nodes using the Eades layout algorithm.
 */
export default class EadesLayouter {

    /**
     * @param {Object} [obj={}]
     * The options object.
     *
     * @param {Vec2} [obj.randomPos=new Vec2(0, 0)]
     * The top left corner of the bounding rectangle of the initial random
     * layout.
     *
     * @param {number} [obj.randomWidth=1920]
     * The width of the bounding rectangle of the initial random layout.
     *
     * @param {number} [obj.randomHeight=1080]
     * The height of the bounding rectangle of the initial random layout.
     *
     * @param {number} [obj.springForceCoef=2]
     * The spring force between two adjacent nodes scales linearly with this
     * parameter.
     *
     * @param {number} [obj.idealDistance=200]
     * If the distance between two adjacent nodes equals this value, the force
     * is 0.
     *
     * @param {number} [obj.repulsiveForceCoef=1]
     * The repulsive force between two non-adjacent nodes scales linearly with
     * this parameter.
     *
     * @param {number} [obj.forceToDistanceCoef=0.1]
     * The conversion from a force to a translation scales linearly with this
     * value.
     *
     * @param {number} [obj.nSteps=100]
     * The number of simulation steps.
     */
    constructor ({
        randomPos           = new Vec2(0, 0),
        randomWidth         = 1920,
        randomHeight        = 1080,
        springForceCoef     = 2,
        idealDistance       = 500,
        repulsiveForceCoef  = 30000,
        forceToDistanceCoef = 1,
        nSteps              = 100,
    } = {}) {

        /**
         * Creates the initial random layout.
         *
         * @type {RandomLayouter}
         * @private
         */
        this.randomLayouter = new RandomLayouter({
            pos:    randomPos,
            width:  randomWidth,
            height: randomHeight,
        });

        /**
         * The spring force between two adjacent nodes scales linearly with
         * this parameter.
         *
         * @type {number}
         * @private
         */
        this.springForceCoef = springForceCoef;

        /**
         * If the distance between two adjacent nodes equals this value, the
         * force is 0.
         *
         * @type {number}
         * @private
         */
        this.idealDistance = idealDistance;

        /**
         * The repulsive force between two non-adjacent nodes scales linearly
         * with this parameter.
         *
         * @type {number}
         * @private
         */
        this.repulsiveForceCoef = repulsiveForceCoef;

        /**
         * The conversion from a force vector to a displacement vector scales
         * linearly with this value.
         *
         * @type {number}
         * @private
         */
        this.forceToDistanceCoef = forceToDistanceCoef;

        /**
         * The number of simulation steps.
         *
         * @type {number}
         * @private
         */
        this.nSteps = nSteps;
    }

    /**
     * Calculates the the spring force between two adjacent nodes.
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
    computeSpringForce(uPos, vPos) {
        const {distance, direction} = utils.computeConnection(uPos, vPos);
        const forceMagnitude        = this.springForceCoef * Math.log(distance / this.idealDistance);
        return direction.mul(forceMagnitude);
    }

    /**
     * Calculated the the repulsive force between non-adjacent nodes.
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
    computeRepulsiveForce(uPos, vPos) {
        let {distance, direction} = utils.computeConnection(uPos, vPos);
        const forceMagnitude      = -this.repulsiveForceCoef / distance**2;
        return direction.mul(forceMagnitude);
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
     * @param {Node} u
     * The node to calculate the force for.
     *
     * @return {Vec2}
     * The force on the given node.
     *
     * @private
     */
    computeForceForNode(graph, layout, u) {
        let result = new Vec2Builder(0, 0);
        const uPos = layout.getPosition(u);

        for (let v of graph.iterNodes()) {
            if (u !== v) {
                const vPos = layout.getPosition(v);
                let force  = u.isAdjacentNode(v) ?
                    this.computeSpringForce(uPos, vPos)   :
                    this.computeRepulsiveForce(uPos, vPos);
                result.add(force);
            }
        }

        return result.toVec2();
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
     * @return {Map}
     * The force on the nodes.
     *
     * @private
     */
    computeForces(graph, layout) {
        const result = new Map();

        for (let u of graph.iterNodes()) {
            const force = this.computeForceForNode(graph, layout, u);
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
     * @private
     */
    adjustLayout(layout, forces) {
        for (let [id, force] of forces) {
            const displacement = force.mul(this.forceToDistanceCoef);
            layout.moveNodeBy(id, displacement);
        }
    }

    /**
     * Layouts the graph using the Eades layout algorithm.
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
        for (let i = 0; i < this.nSteps; i++) {
            const forces = this.computeForces(graph, layout);
            this.adjustLayout(layout, forces);
        }

        return layout;
    }
}
