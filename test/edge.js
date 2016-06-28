import {expect} from "chai";

import {Node, Edge} from "../src/index.js";

describe("Edge", function () {
    beforeEach(function () {
        this.n0 = new Node();
        this.n1 = new Node();

        this.e0 = new Edge(this.n0, this.n1);
        this.e1 = new Edge(this.n0, this.n1);
    });

    describe("#fromJSON", function () {
        it("should convert a plain JSON object back to an Edge object", function () {
            const r = Edge.fromJSON(new Edge("n0", "n1", "e0").toJSON());
            expect(r.id).to.equal("e0");
            expect(r.sourceId).to.equal("n0");
            expect(r.targetId).to.equal("n1");
        });
    });

    describe("#constructor", function () {
        it("should set the source ID", function () {
            expect(this.e0.sourceId).to.equal(this.n0.id);
        });

        it("should set the target ID", function () {
            expect(this.e0.targetId).to.equal(this.n1.id);
        });

        it("should set edge IDs", function () {
            expect(this.e0.id).to.be.a("string");
            expect(this.e1.id).to.be.a("string");
            expect(this.e0.id).to.not.equal(this.e1.id);
        });
    });

    describe("#toString", function() {
        it("should return a string", function () {
            expect(this.e0.toString()).to.be.a("string");
        });
    });

    describe("#toJSON", function() {
        it("should encode all information to reconstruct the edge object", function () {
            const r = new Edge("n0", "n1", "e0").toJSON();
            expect(r.id).to.equal("e0");
            expect(r.source).to.equal("n0");
            expect(r.target).to.equal("n1");
        });
    });

    after(function () {
        delete this.n0;
        delete this.n1;
        delete this.e0;
        delete this.e1;
    });
});
