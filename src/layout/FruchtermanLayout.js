import {Vec2, Vec2Builder} from "@ignavia/ella";

import randomLayout from "./randomLayout";

export default class FruchtermannLayout {

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
     * @param {number} initialMaxDisplacement
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
         * @type {RandomLayout}
         * @private
         */
        this.randomLayout = new RandomLayout({
            pos:    randomPos,
            width:  randomWidth,
            height: randomHeight,
        });

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
     */
    computeIdealDistance(graph) {
        return this.idealDistanceCoef * Math.sqrt(this.area / graph.getNumberOfNodes());
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

    computeAttractiveDisplacement(uPos, vPos, idealDistance) {
        const {distance, direction} = this.computeConnection(uPos, vPos);
        const displacementMagnitude = distance**2 / idealDistance;
        return direction.mul(displacementMagnitude);
    }

    computeRepulsiveDisplacement(uPos, vPos, idealDistance) {
        const {distance, direction} = this.computeConnection(uPos, vPos);
        const displacementMagnitude = -(idealDistance**2) / distance;
        return direction.mul(displacementMagnitude);
    }

    computeMaxDisplacement(step) {
        return this.initialMaxDisplacement * (1 - step / nStep);
    }

    computeRepulsiveForces(graph, layout, idealDistance) {
        const result = new Map();

        for (let u of graph.iterNodes()) {
            result.set(u.id, new Vec2Builder(0, 0));
            const uPos = layout.get(u.id);
            for (let v of graph.iterNodes()) {
                if (u === v) {
                    continue;
                }
                const vPos = layout.get(v.id);
                const change = this.computeRepulsiveDisplacement(uPos, vPos, idealDistance);

                const oldDisp = result.get(u.id);
                const newDisp = oldDisp.add(change);
                result.set(o.id, newDisp);
            }
        }
        return result;
    }
// Merge, structure of eades
    computeAttractiveForces(graph, layout, disp, idealDistance) {
        for (let e of graph.iterEdges()) {
            const u = e.sourceId;
            const v = e.targetId;

            const uPos = layout.getPosition(u);
            const vPos = layout.getPosition(v);

            const change = this.computeAttractiveDisplacement(uPos, vPos, idealDistance);

            const oldUDisp = disp.get(u);
            const newUDisp = oldUDisp.add(change);
            disp.set(u, newUDisp);

            const oldVDisp = disp.get(v);
            const newVDisp = oldVDisp.sub(change);
            disp.set(v, newVDisp);
        }
    }

    /**
     * Calculates the displacements of the nodes given the current layout.
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
    computeDisplacements(graph, layout, idealDistance) {
        const result = new Map();

        for (let u of graph.iterNodes()) {
            const force = this.computeForceForNode(layout, graph, u);
            result.set(u.id, force);
        }

        return result;
    }

    /**
     * Moves the nodes according to the displacements calculated in a
     * simulation step.
     *
     * @param {Map} layout
     * The current layout of the graph.
     *
     * @param {Map} displacements
     * The calculated displacements.
     *
     * @param {number} maxDisplacement
     * The maximum distance to move a node.
     *
     * @private
     */
    adjustLayout(layout, displacements, maxDisplacement) {
        for (let [id, displacement] of displacements) {
            const distance     = Math.min(maxDisplacement, displacement.length());
            const direction    = displacement.normalize();
            const displacement = direction.mul(distance);
            const oldPos       = layout.getPosition(id);
            const newPos       = oldPos.add(displacement);
            const newX         = Math.max(this.min.x, Math.min(newPos.x, this.max.x));
            const newY         = Math.max(this.min.y, Math.min(newPos.y, this.max.y));
            layout.moveNodeT(id, new Vec2(newX, newY));
        }
    }

    /**
     * Layouts the graph using the Fruchterman-Reingold layout algorithm.
     *
     * @param {Graph} graph
     * The graph to layout.
     */
    layout(graph) {
        const result        = this.randomLayout.layout(graph);
        const idealDistance = this.computeIdealDistance(graph);
        let   temperature   = initialTemperature;

        for (let i = 0; i < this.nSteps; i++) {
            const displacements   = computeDisplacements(graph, result, idealDistance);
            const maxDisplacement = this.computeMaxDisplacement(i);
            this.adjustLayout(result, displacements, maxDisplacement);
        }

        return result;
    }
}
