import {expect} from "chai";

import {Node, Path} from "../src/earl.js";

describe("Path", function () {
    describe("#fromJSON", function () {
        it("should convert a plain JSON object back to a Path object", function () {
            const n0 = new Node("n0");
            const n1 = new Node("n1");
            const r  = Path.fromJSON(new Path(n0, n1).toJSON());
            expect(r.toArray()).to.eql(["n0", "n1"]);
        });
    });

    describe("#constructor", function () {
        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();

        const p0 = new Path(n0);
        const p1 = new Path(n0, n0);
        const p2 = new Path(n0, n1, n1, n0);
        const p3 = new Path(n0, n1, n2);
        const p4 = new Path(n0, n1, n2, n1);
        const p5 = new Path(n0, n0, n0);

        it("should set the isCycle variable", function () {
            expect(p0.isCycle).to.equal(false);
            expect(p1.isCycle).to.equal(true);
            expect(p2.isCycle).to.equal(true);
            expect(p3.isCycle).to.equal(false);
            expect(p4.isCycle).to.equal(false);
            expect(p5.isCycle).to.equal(true);
        });

        it("should set the isSimpleCycle variable", function () {
            expect(p0.isSimpleCycle).to.equal(false);
            expect(p1.isSimpleCycle).to.equal(true);
            expect(p2.isSimpleCycle).to.equal(false);
            expect(p3.isSimpleCycle).to.equal(false);
            expect(p4.isSimpleCycle).to.equal(false);
            expect(p5.isSimpleCycle).to.equal(false);
        });

        it("should set the isSimplePath variable", function () {
            expect(p0.isSimplePath).to.equal(true);
            expect(p1.isSimplePath).to.equal(false);
            expect(p2.isSimplePath).to.equal(false);
            expect(p3.isSimplePath).to.equal(true);
            expect(p4.isSimplePath).to.equal(false);
            expect(p5.isSimplePath).to.equal(false);
        });
    });

    describe("#getLength", function () {
        const n0 = new Node();
        const n1 = new Node();

        const p0 = new Path(n0);
        const p1 = new Path(n0.id, n1);
        const p2 = new Path();

        it("should return the length of the path", function () {
            const r0 = p0.getLength();
            expect(r0).to.equal(0);

            const r1 = p1.getLength();
            expect(r1).to.equal(1);

            const r2 = p2.getLength();
            expect(r2).to.equal(-1);
        });
    });

    describe("#getNumberOfVisits", function () {
        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();

        const p0 = new Path(n0, n1, n2, n1);

        it("should return how often a node is visited by a path", function () {
            const r0 = p0.getNumberOfVisits(n0);
            expect(r0).to.equal(1);

            const r1 = p0.getNumberOfVisits(n1);
            expect(r1).to.equal(2);

            const r2 = p0.getNumberOfVisits(n2.id);
            expect(r2).to.equal(1);

            const r3 = p0.getNumberOfVisits("n3");
            expect(r3).to.equal(0);
        });
    });

    describe("#isVisited", function () {
        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();

        const p0 = new Path(n0, n1, n2, n1);

        it("should return if a node lies on this path", function () {
            const r0 = p0.isVisited(n0);
            expect(r0).to.equal(true);

            const r1 = p0.isVisited(n1);
            expect(r1).to.equal(true);

            const r2 = p0.isVisited(n2.id);
            expect(r2).to.equal(true);

            const r3 = p0.isVisited("n3");
            expect(r3).to.equal(false);
        });
    });

    describe("#toArray", function () {
        const n0 = new Node();

        const p0 = new Path(n0);
        const p1 = new Path(n0.id);
        const p2 = new Path();

        it("should return an array with the IDs of the nodes on the path in order", function () {
            const r0 = p0.toArray();
            expect(r0).to.contain(n0.id);
            expect(r0.length).to.equal(1);

            const r1 = p1.toArray();
            expect(r1).to.contain(n0.id);
            expect(r1.length).to.equal(1);

            const r2 = p2.toArray();
            expect(r2.length).to.equal(0);
        });
    });

    describe("#toString", function() {
        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();

        const p = new Path(n0, n1, n2);

        it("should return a string", function () {
            expect(p.toString()).to.be.a("string");
        });
    });

    describe("#toJSON", function () {
        it("should encode all information to reconstruct the node object", function () {
            const n0 = new Node("n0");
            const n1 = new Node("n1");
            const r  = new Path(n0, n1).toJSON();
            expect(r.nodes).to.eql(["n0", "n1"]);
        });
    });
});
