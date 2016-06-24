import {expect} from "chai";

import {Graph, Node, RandomLayout} from "../src/index.js";

describe("Layout", function () {
    before(function () {
        this.g = new Graph();

        const n0 = new Node("n0");
        const n1 = new Node("n1");
        this.g.addNodes(n0, n1);

        this.ran = new RandomLayout();
    });

    describe("#randomLayout", function () {
        it("should randomly align the nodes in the given rectangle", function () {
            for (let i = 0; i < 100; i++) {
                const l = this.ran.layout(this.g);

                const pos0 = l.getPosition("n0");
                expect(pos0.x).to.be.within(0, 1920);
                expect(pos0.y).to.be.within(0, 1080);

                const pos1 = l.getPosition("n1");
                expect(pos1.x).to.be.within(0, 1920);
                expect(pos1.y).to.be.within(0, 1080);
            }
        });
    });

    after(function () {
        delete this.g;
    });
});
