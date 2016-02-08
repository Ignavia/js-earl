/* global describe */
/* global it */
import {expect} from "chai";

import {Graph, Node, Edge, EdgeHashIndex} from "../../../js/earl/earl.js";

/** @test {EdgeHashIndex} */
describe("EdgeHashIndex", function () {
    const g0 = new Graph();

    const n0 = new Node(),
          n1 = new Node();
    g0.addNodes([n0, n1]);

    const e0 = new Edge(n0, n1, {url: "http://example.org"}),
          e1 = new Edge(n0, n1, {url: "http://example.org"}),
          e2 = new Edge(n0, n1, {url: "http://example.com"}),
          e3 = new Edge(n0, n1);
    g0.addEdges([e0, e1, e2, e3]);

    const p0 = new EdgeHashIndex((e) => e.data ? e.data.url : undefined, {
        getterName:   "getEdgesWithUrl",
        iteratorName: "iterEdgesWithUrl"
    });
    g0.addPlugins(p0);

    it("should add edges", function () {
        const r0 = g0.getEdgesWithUrl("http://example.org");
        expect(r0).to.contain(e0.id);
        expect(r0).to.contain(e1.id);
        expect(r0.length).to.equal(2);

        const r1 = g0.getEdgesWithUrl(e2, true);
        expect(r1).to.contain(e2.id);
        expect(r1.length).to.equal(1);

        const r2 = g0.getEdgesWithUrl("test");
        expect(r2.length).to.equal(0);
    });

    it("should updates edges when a function is mapped over them", function () {
        g0.mapEdges((e) => e.data = {url: "http://test.de"}, {edges: [e2, e3]});

        const r0 = g0.getEdgesWithUrl("http://example.org");
        expect(r0).to.contain(e0.id);
        expect(r0).to.contain(e1.id);
        expect(r0.length).to.equal(2);

        const r1 = g0.getEdgesWithUrl("http://example.com");
        expect(r1.length).to.equal(0);

        const r2 = g0.getEdgesWithUrl(e2, true);
        expect(r2).to.contain(e2.id);
        expect(r2).to.contain(e3.id);
        expect(r2.length).to.equal(2);
    });

    it("should remove edges", function () {
        g0.removeEdges([e2, e3]);

        const r0 = g0.getEdgesWithUrl(e0, true);
        expect(r0).to.contain(e0.id);
        expect(r0).to.contain(e1.id);
        expect(r0.length).to.equal(2);

        const r1 = g0.getEdgesWithUrl("http://test.de");
        expect(r1.length).to.equal(0);
    });
});
