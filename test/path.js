/* global describe */
/* global it */
import {expect} from "chai";

import {Graph, Node, Path} from "../src/earl.js";

/** @test {Path} */
describe("Path", function () {

    /** @test {Path#constructor} */
    describe("#constructor", function () {
        const g0 = new Graph();

        const n0 = new Node(),
            n1 = new Node(),
            n2 = new Node();
        g0.addNodes([n0, n1, n2]);

        const p0 = new Path(n0),
            p1 = new Path([n0, n0]),
            p2 = new Path([n0, n1, n1, n0]),
            p3 = new Path([n0, n1, n2]),
            p4 = new Path([n0, n1, n2, n1]),
            p5 = new Path([n0, n0, n0]);

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
            expect(p5.isSimplePath).to.equal(false)
        });
    });

    /** @test {Path#getLength} */
    describe("#getLength", function () {
        const g0 = new Graph();

        const n0 = new Node(),
            n1 = new Node(),
            n2 = new Node();
        g0.addNodes([n0, n1, n2]);

        const p0 = new Path(n0),
            p1 = new Path([n0]),
            p2 = new Path([n0.id, n1]),
            p3 = new Path([]);

        it("should return the length of the path", function () {
            const r0 = p0.getLength();
            expect(r0).to.equal(0);

            const r1 = p1.getLength();
            expect(r1).to.equal(0);

            const r2 = p2.getLength();
            expect(r2).to.equal(1);

            const r3 = p3.getLength();
            expect(r3).to.equal(-1);
        });
    });

    /** @test {Path#getNumberOfVisits} */
    describe("#getNumberOfVisits", function () {
        const g0 = new Graph();

        const n0 = new Node(),
            n1 = new Node(),
            n2 = new Node();
        g0.addNodes([n0, n1, n2]);

        const p0 = new Path([n0, n1, n2, n1]);

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

    /** @test {Path#isVisited} */
    describe("#isVisited", function () {
        const g0 = new Graph();

        const n0 = new Node(),
            n1 = new Node(),
            n2 = new Node();
        g0.addNodes([n0, n1, n2]);

        const p0 = new Path([n0, n1, n2, n1]);

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

    /** @test {Path#toArray} */
    describe("#toArray", function () {
        const g0 = new Graph();

        const n0 = new Node(),
            n1 = new Node(),
            n2 = new Node();
        g0.addNodes([n0, n1, n2]);

        const p0 = new Path(n0),
            p1 = new Path([n0]),
            p2 = new Path([n0.id]),
            p3 = new Path([]);

        it("should return an array with the IDs of the nodes on the path in order", function () {
            const r0 = p0.toArray();
            expect(r0).to.contain(n0.id);
            expect(r0.length).to.equal(1);

            const r1 = p1.toArray();
            expect(r1).to.contain(n0.id);
            expect(r1.length).to.equal(1);

            const r2 = p2.toArray();
            expect(r2).to.contain(n0.id);
            expect(r2.length).to.equal(1);

            const r3 = p3.toArray();
            expect(r3.length).to.equal(0);
        });
    });

    /** @test {Path#toString} */
    describe("#toString", function() {
        const g0 = new Graph();

        const n0 = new Node(),
            n1 = new Node(),
            n2 = new Node();
        g0.addNodes([n0, n1, n2]);

        const p0 = new Path([n0, n1, n2]);

        it("should return a string", function () {
            expect(p0.toString()).to.be.a("string");
        });
    });
});
