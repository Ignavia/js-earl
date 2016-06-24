import {Vec2Builder} from "@ignavia/ella";

import RandomLayout from "./randomLayout.js";

export default class EadesLayout {

    /*
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
        idealDistance       = 200,
        repulsiveForceCoef  = 1,
        forceToDistanceCoef = 0.1,
        nSteps              = 100,
    } = {}) {

        /**
         * Creates the initial random layout.
         *
         * @type {RandomLayout}
         * @private
         */
        this.randomLayout = new RandomLayout({
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
        this.forceToDisplacementCoef = forceToDisplacementCoef;

        /**
         * The number of simulation steps.
         *
         * @type {number}
         * @private
         */
        this.nSteps = nSteps;
    }

    /**
     * Computes the distance between the two points and a normalized direction
     * vector from the first to the second.
     *
     * @param {Vec2} uPos
     * The first position.
     *
     * @param {Vec2} vPos
     * The second position.
     *
     * @return {Object}
     * The distance and direction.
     *
     * @private
     */
    computeConnection(uPos, vPos) {
        const connection = vPos.sub(uPos);
        return {
            distance:  connection.length(),
            direction: connection.normalize(),
        };
    }

    /**
     * Calculates the magnitude of the spring force between two adjacent nodes.
     *
     * @param {number} distance
     * How far the nodes are apart.
     *
     * @return {Vec2}
     * The force vector.
     *
     * @private
     */
    computeSpringForce(uPos, vPos) {
        const {distance, direction} = this.computeConnection(uPos, vPos);
        const forceMagnitude        = this.springForceCoef * Math.log(distance / this.idealDistance);
        return direction.mul(forceMagnitude);
    }

    /**
     * Calculated the magnitude of the repulsive force between non-adjacent nodes.
     *
     * @param {number} distance
     * How far the nodes are apart.
     *
     * @return {Vec2}
     * The force vector.
     *
     * @private
     */
    computeRepulsiveForce(uPos, vPos) {
        const {distance, direction} = this.computeConnection(uPos, vPos);
        const forceMagnitude        = -this.repulsiveForceCoef / distance**2;
        return direction.mul(forceMagnitude);
    }

    /**
     * Calculates the force on the given node given a layout.
     *
     * @param {Map} layout
     * The current layout of the graph.
     *
     * @param {Graph} graph
     * The graph to layout.
     *
     * @param {Node} u
     * The node to calculate the force for.
     *
     * @return {Vec2}
     * The force on the given node.
     *
     * @private
     */
    computeForceForNode(layout, graph, u) {
        const result = new Vec2(0, 0);
        const uPos   = layout.getPosition(u);

        for (let v of graph.iterNodes()) {
            if (u !== v) {
                const vPos = layout.getPosition(v);
                if (u.isAdjacentNode(v)) {
                    result.add(this.computeSpringForce(uPos, vPos));
                } else {
                    result.add(this.computeRepulsiveForce(uPos, vPos));
                }
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
     * @return {Map}
     * The force on the nodes.
     *
     * @private
     */
    computeForces(graph, layout) {
        const result = new Map();

        for (let u of graph.iterNodes()) {
            const force = this.computeForceForNode(layout, graph, u);
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
            const displacement = force.mul(this.forceToDisplacementCoef);
            layout.moveNodeBy(id, displacement);
        }
    }

    /**
     * Layouts the graph using the Eades layout algorithm.
     *
     * @param {Graph} graph
     * The graph to layout.
     */
    layout(graph) {
        const result = this.randomLayout.layout(graph);

        for (let i = 0; i < this.nSteps; i++) {
            const forces = this.computeForces(graph, result);
            this.adjustLayout(result, forces);
        }

        return result;
    }
}
