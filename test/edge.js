/* global describe */
/* global it */
import {expect} from "chai";

import {Graph, Node, Edge} from "@ignavia/earl";

export default function () {

    /** @test {Edge} */
    describe("Edge", function () {

        /** @test {Edge#constructor} */
        describe("#constructor", function () {
            const g0 = new Graph();

            const n0 = new Node(),
                n1 = new Node();
            g0.addNodes([n0, n1]);

            const e0 = new Edge(n0, n1);
            g0.addEdges(e0);

            it("should set the source ID", function () {
                expect(e0.sourceId).to.equal(n0.id);
            });

            it("should set the target ID", function () {
                expect(e0.targetId).to.equal(n1.id);
            });
        });

        /** @test {Edge#toString} */
        describe("#toString", function() {
            const g0 = new Graph();

            const n0 = new Node(),
                n1 = new Node();
            g0.addNodes([n0, n1]);

            const e0 = new Edge(n0, n1);
            g0.addEdges(e0);

            it("should return a string", function () {
                expect(e0.toString()).to.be.a("string");
            });
        });
    });
}
