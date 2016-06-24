import {Vec2Builder} from "@ignavia/ella";

import randomLayout from "./randomLayout.js";

/**
 * Calculates the magnitude of the spring force between two adjacent nodes.
 *
 * @param {Number} distance
 * How far the nodes are apart.
 *
 * @param {Number} springForceCoef
 * The result scales linearly with this parameter.
 *
 * @param {Number} idealDistance
 * If the distance equals this value, the force is 0.
 *
 * @return {Number}
 * The magnitude of the force.
 *
 * @ignore
 */
function springForce(distance, springForceCoef, idealDistance) {
    return springForceCoef * Math.log(distance / idealDistance);
}

/**
 * Calculated the magnitude of the repulsive force between non-adjacent nodes.
 *
 * @param {Number} distance
 * How far the nodes are apart.
 *
 * @param {Number} repulsiveForceCoef
 * The result scales linearly with this parameter.
 *
 * @return {Number}
 * The magnitude of the force.
 *
 * @ignore
 */
function repulsiveForce(distance, repulsiveForceCoef) {
    return repulsiveForce / distance**2;
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
 * @param {Node} node
 * The node to calculate the force for.
 *
 * @param {Object} params
 * The parameters of the algorithm.
 *
 * @return {Vec2Builder}
 * The force on the given node.
 *
 * @ignore
 */
function calculateForceForNode(layout, graph, node1, params) {
        const force = new Vec2Builder(0, 0);
        const pos1  = layout.get(node1.id).toVec2();

        for (let node2 of graph.iterNodes()) {
            if (node1 === node2) {
                continue;
            }

            const pos2       = layout.get(node2.id);
            const connection = Vec2Builder.fromVec2(pos1.sub(pos2));
            const distance   = connection.length;

            if (node1.isAdjacentNode(node2)) {
                const magnitude = springForce(distance, params.springForceCoef, params.idealDistance);
                const direction = connection.mul(-1).normalize();
                force.add(direction.mul(magnitude));
            } else {
                const magnitude = repulsiveForce(distance, params.repulsiveForceCoef);
                const direction = connection.normalize();
                force.add(direction.mul(magnitude));
            }
        }

        return force;
}

/**
 * Calculates the forces on the nodes given the current layout.
 *
 * @param {Map} layout
 * The current layout of the graph.
 *
 * @param {Graph} graph
 * The graph to layout.
 *
 * @param {Object} params
 * The parameters of the algorithm.
 *
 * @return {Map}
 * The force on the nodes.
 *
 * @ignore
 */
function calculateForces(layout, graph, params) {
    const forces = new Map();
    for (let node1 of graph.iterNodes()) {
        const force = calculateForceForNode(layout, graph, node1, params);
        forces.set(node1.id, force);
    }
    return forces;
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
 * @param {Number} forceToDistanceCoef
 * The conversion from a force to a translation scales linearly with this value.
 *
 * @ignore
 */
function adjustLayout(layout, forces, forceToDistanceCoef) {
    for (let [id, force] of forces) {
        layout.get(id).add(forceToDistanceCoef * force);
    }
}

/**
 * Layouts the graph using the Eades layout algorithm.
 *
 * @param {Graph} graph
 * The graph to layout.
 *
 * @param {Object} [obj={}]
 * The options object.
 *
 * @param {Vec2} [randomPos=new Vec2(0, 0)]
 * The top left corner of the bounding rectangle of the initial random layout.
 *
 * @param {number} [randomWidth=1920]
 * The width of the bounding rectangle of the initial random layout.
 *
 * @param {number} [randomHeight=1080]
 * The height of the bounding rectangle of the initial random layout.
 *
 * @param {Number} [obj.springForceCoef=2]
 * The spring force between two adjacent nodes scales linearly with this
 * parameter.
 *
 * @param {Number} [obj.idealDistance=200]
 * If the distance between two adjacent nodes equals this value, the force is 0.
 *
 * @param {Number} [obj.repulsiveForceCoef=1]
 * The repulsive force between two non-adjacent nodes scales linearly with this
 * parameter.
 *
 * @param {Number} [obj.forceToDistanceCoef=0.1]
 * The conversion from a force to a translation scales linearly with this value.
 *
 * @param {Number} [nSteps=100]
 * The number of simulation steps.
 */
export default function(graph, {
        randomPos           = new Vec2(0, 0),
        randomWidth         = 1920,
        randomHeight        = 1080,
        springForceCoef     = 2,
        idealDistance       = 200,
        repulsiveForceCoef  = 1,
        forceToDistanceCoef = 0.1,
        nSteps              = 100,
    } = {}) {

    const result = randomLayout({
        pos:    randomPos,
        width:  randomWidth,
        height: randomHeight,
    });

    for (let i = 0; i < nSteps; i++) {
        const forces = calculateForces(result, graph, {
            springForceCoef,
            idealDistance,
            repulsiveForceCoef,
        });
        adjustLayout(result, forces, forceToDistanceCoef);
    }

    return result;
}
