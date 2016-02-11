/* global describe */
/* global it */
import {expect} from "chai";

import {Node, Edge} from "../src/earl.js";

/** @test {Edge} */
describe("Edge", function () {

    /** @test {Edge#constructor} */
    describe("#constructor", function () {
        const n0 = new Node(),
              n1 = new Node();

        const e0 = new Edge(n0, n1),
              e1 = new Edge(n0, n1);

        it("should set the source ID", function () {
            expect(e0.sourceId).to.equal(n0.id);
        });

        it("should set the target ID", function () {
            expect(e0.targetId).to.equal(n1.id);
        });

        it("should set edge IDs", function () {
            expect(e0.id).to.be.a("string");
            expect(e1.id).to.be.a("string");
            expect(e0.id).to.not.equal(e1.id);
        });
    });

    /** @test {Edge#toString} */
    describe("#toString", function() {
        const n0 = new Node(),
              n1 = new Node();

        const e0 = new Edge(n0, n1);

        it("should return a string", function () {
            expect(e0.toString()).to.be.a("string");
        });
    });
});
