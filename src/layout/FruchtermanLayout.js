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

    idealDistance(graph, width, height, idealDistanceCoef) {
        return this.idealDistanceCoef * Math.sqrt(width * height / graph.getNumberOfNodes());
    }

    attractiveForce(distance, idealDistance) {
        return distance**2 / idealDistance;
    }

    repulsiveForce(distance, idealDistance) {
        return -(idealDistance**2) / distance;
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
                const connection = vPos.sub(uPos);

                const distance = connection.length();
                const direction = connection.normalize();
                const magnitude = repulsiveForce(distance, idealDistance);

                const change = direction.mul(magnitude);

                const oldDisp = result.get(u.id);
                oldDisp.add(change);
            }
        }
        return result;
    }

    computeAttractiveForces(graph, layout, disp, idealDistance) {
        for (let e of graph.iterEdges()) {
            const u = e.sourceId;
            const v = e.targetId;

            const uPos = layout.getPosition(u);
            const vPos = layout.getPosition(v);

            const connection = vPos.sub(uPos);

            const distance = connection.length();
            const direction = connection.normalize();
            const magnitude = attractiveForce(distance, idealDistance);

            const change = direction.mul(magnitude);

            const oldUDisp = disp.get(u);
            oldUDisp.add(change);

            const oldVDisp = disp.get(v);
            oldVDisp.sub(change);
        }
    }

    computeDisplacements(graph, layout, idealDistance) {
        const result = computeRepulsiveForces(graph, layout, idealDistance);
        computeAttractiveForces(graph, layout, result, idealDistance);

        return result;
    }

    moveNodes() {

    }

    cool(initialTemperature, nSteps, step) {
        return initialTemperature * (1 - step / nSteps);
    }

    /**
     * Layouts the graph using the Fruchterman-Reingold layout algorithm.
     *
     * @param {Graph} graph
     * The graph to layout.
     */
    layout(graph) {
        const result      = this.randomLayout.layout(graph);
        const idealDist   = idealDistance(graph, width, height, idealDistanceCoef);
        let   temperature = initialTemperature;

        for (let i = 1; i <= nSteps; i++) {
            const displacements = computeDisplacements(graph, result, idealDistance);
            moveNodes(layout, displacements, pos, width, height, temperature);
            temperature = cool(initialTemperature, nSteps, i);
        }

        return result;
    }
}
