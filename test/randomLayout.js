import {expect} from "chai";

import {Graph, Node, Layout, randomLayout} from "../src/earl.js";

describe("Layout", function () {
    before(function () {
        this.g = new Graph();

        const n0 = new Node("n0");
        const n1 = new Node("n1");
        this.g.addNodes(n0, n1);
    });

    describe("#randomLayout", function () {
        it("should randomly align the nodes in the given rectangle", function () {
            for (let i = 0; i < 100; i++) {
                const l = randomLayout(this.g);

                const pos0 = l.getPosition("n0");
                expect(pos0.x).to.be.within(0, 1);
                expect(pos0.y).to.be.within(0, 1);

                const pos1 = l.getPosition("n1");
                expect(pos1.x).to.be.within(0, 1);
                expect(pos1.y).to.be.within(0, 1);
            }
        });
    });

    after(function () {
        delete this.g;
    });
});
