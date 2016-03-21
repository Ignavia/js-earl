import {expect} from "chai";

import {Node, Edge} from "../src/earl.js";

describe("Edge", function () {
    beforeEach(function () {
        this.n0 = new Node();
        this.n1 = new Node();

        this.e0 = new Edge(this.n0, this.n1);
        this.e1 = new Edge(this.n0, this.n1);
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

    after(function () {
        delete this.n0;
        delete this.n1;
        delete this.e0;
        delete this.e1;
    });
});
