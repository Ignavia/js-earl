/* global describe */
/* global it */
import {expect} from "chai";

import {Graph, Node, NodeHashIndex} from "../../../js/earl/earl.js";

/** @test {NodeHashIndex} */
describe("NodeHashIndex", function () {
    const g0 = new Graph();

    const n0 = new Node({url: "http://example.org"}),
          n1 = new Node({url: "http://example.org"}),
          n2 = new Node({url: "http://example.com"}),
          n3 = new Node();
    g0.addNodes([n0, n1, n2, n3]);

    const p0 = new NodeHashIndex((n) => n.data ? n.data.url : undefined, {
        getterName:   "getNodesWithUrl",
        iteratorName: "iterNodesWithUrl"
    });
    g0.addPlugins(p0);

    it("should add nodes", function () {
        const r0 = g0.getNodesWithUrl("http://example.org");
        expect(r0).to.contain(n0.id);
        expect(r0).to.contain(n1.id);
        expect(r0.length).to.equal(2);

        const r1 = g0.getNodesWithUrl(n2, true);
        expect(r1).to.contain(n2.id);
        expect(r1.length).to.equal(1);

        const r2 = g0.getNodesWithUrl("test");
        expect(r2.length).to.equal(0);
    });

    it("should updates nodes when a function is mapped over them", function () {
        g0.mapNodes((n) => n.data = {url: "http://test.de"}, {nodes: [n2, n3]});

        const r0 = g0.getNodesWithUrl("http://example.org");
        expect(r0).to.contain(n0.id);
        expect(r0).to.contain(n1.id);
        expect(r0.length).to.equal(2);

        const r1 = g0.getNodesWithUrl("http://example.com");
        expect(r1.length).to.equal(0);

        const r2 = g0.getNodesWithUrl(n2, true);
        expect(r2).to.contain(n2.id);
        expect(r2).to.contain(n3.id);
        expect(r2.length).to.equal(2);
    });

    it("should remove nodes", function () {
        g0.removeNodes([n2, n3]);

        const r0 = g0.getNodesWithUrl(n0, true);
        expect(r0).to.contain(n0.id);
        expect(r0).to.contain(n1.id);
        expect(r0.length).to.equal(2);

        const r1 = g0.getNodesWithUrl("http://test.de");
        expect(r1.length).to.equal(0);
    });
});
