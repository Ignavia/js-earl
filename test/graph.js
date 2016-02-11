/* global describe */
/* global it */
import {expect} from "chai";

import {extensibleSymbols as extSym, observableSymbols as obsSym} from "@ignavia/util";
const addMethod   = extSym.addMethod,
      addPlugin   = extSym.addPlugin,
      addListener = obsSym.addListener;


import {Graph, Node, Edge} from "../src/earl.js";

/** @test {Graph} */
describe("Graph", function () {

    /** @test {Graph#constructor} */
    describe("#constructor", function () {
        const g0 = new Graph(),
                g1 = new Graph();

        it("should set graph IDs", function () {
            expect(g0.id).to.be.a("string");
            expect(g1.id).to.be.a("string");
            expect(g0.id).to.not.equal(g1.id);
        });
    });

    /** @test {Graph#addNodes} */
    describe("#addNodes", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0]);
        g0.addNodes(n1);

        it("should set the graph reference in the node", function () {
            expect(n0.graph).to.equal(g0);
            expect(n1.graph).to.equal(g0);
        });

        it("should add nodes", function () {
            expect(g0.getNodeById(n0.id)).to.equal(n0);
            expect(g0.getNodeById(n1.id)).to.equal(n1);
        });

        it("should notify listeners", function () {
            let r0;
            g0[addListener](e => r0 = e, "addNodes");

            const n2 = new Node();
            g0.addNodes(n2);

            expect(r0.type).to.equal("addNodes");
            expect(r0.data).to.contain(n2);
            expect(r0.data.length).to.equal(1);
        });

        it("should return the graph object", function () {
            const r0 = g0.addNodes(new Node());
            expect(r0).to.equal(g0);
        });
    });

    /** @test {Graph#addEdges} */
    describe("#addEdges", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n0, n1);
        g0.addEdges(e0);
        g0.addEdges([e1]);

        it("should throw if a source ID is invalid", function () {
            const e2 = new Edge("no_id", n0),
                    f  = () => g0.addEdges(e2);

            expect(f).to.throw(Error);
        });

        it("should throw if a target ID is invalid", function () {
            const e2 = new Edge(n0, "no_id"),
                    f  = () => g0.addEdges(e2);

            expect(f).to.throw(Error);
        });

        it("should set the graph reference in the edge", function () {
            expect(e0.graph).to.equal(g0);
            expect(e1.graph).to.equal(g0);
        });

        it("should add edges", function () {
            expect(g0.getEdgeById(e0.id)).to.equal(e0);
            expect(g0.getEdgeById(e1.id)).to.equal(e1);
        });

        it("should notify listeners", function () {
            let r0;
            g0[addListener](e => r0 = e, "addEdges");

            const e2 = new Edge(n0, n1);
            g0.addEdges(e2);

            expect(r0.type).to.equal("addEdges");
            expect(r0.data).to.contain(e2);
            expect(r0.data.length).to.equal(1);
        });

        it("should return the graph object", function () {
            const r0 = g0.addEdges(new Edge(n0, n1));
            expect(r0).to.equal(g0);
        });
    });

    /** @test {Graph#removeNodes} */
    describe("#removeNodes", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node(),
                n2 = new Node(),
                n3 = new Node();
        g0.addNodes([n0, n1, n2, n3]);

        const e0 = new Edge(n0, n3),
                e1 = new Edge(n1, n2);
        g0.addEdges([e0, e1]);

        g0.removeNodes(n3);

        it("should remove the selected nodes", function () {
            const r0 = [...g0.iterNodes()];
            expect(r0).to.contain(n0);
            expect(r0).to.contain(n1);
            expect(r0).to.contain(n2);
            expect(r0.length).to.equal(3);
        });

        it("should remove incident edges", function () {
            const r0 = g0.getNumberOfEdges();
            expect(r0).to.equal(1);
        });

        it("should notify listeners", function () {
            let r0;
            g0[addListener](e => r0 = e, "removeNodes");
            g0.removeNodes(n0);

            expect(r0.type).to.equal("removeNodes");
            expect(r0.data).to.contain(n0);
            expect(r0.data.length).to.equal(1);
        });

        it("should return the deleted nodes and edges", function () {
            const r0 = g0.removeNodes([n1.id, n2]);
            expect(r0.nodes).to.contain(n1);
            expect(r0.nodes).to.contain(n2);
            expect(r0.nodes.length).to.equal(2);
            expect(r0.edges).to.contain(e1);
            expect(r0.edges.length).to.equal(1);

            const r1 = g0.removeNodes("n4");
            expect(r1.nodes.length).to.equal(0);
            expect(r1.edges.length).to.equal(0);
        });
    });

    /** @test {Graph#removeEdges} */
    describe("#removeEdges", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n0, n1),
                e2 = new Edge(n0, n1),
                e3 = new Edge(n0, n1);
        g0.addEdges([e0, e1, e2, e3]);

        g0.removeEdges(e3);

        it("should remove the selected edges", function () {
            const r0 = [...g0.iterEdges()];
            expect(r0).to.contain(e0);
            expect(r0.length).to.equal(3);
        });

        it("should notify listeners", function () {
            let r0;
            g0[addListener](e => r0 = e, "removeEdges");
            g0.removeEdges(e0);

            expect(r0.type).to.equal("removeEdges");
            expect(r0.data).to.contain(e0);
            expect(r0.data.length).to.equal(1);
        });

        it("should return the deleted edges", function () {
            const r0 = g0.removeEdges([e1.id, e2]);
            expect(r0).to.contain(e1);
            expect(r0).to.contain(e2);
            expect(r0.length).to.equal(2);

            const r1 = g0.removeEdges("e4");
            expect(r1.length).to.equal(0);
        });
    });

    /** @test {Graph#getNumberOfNodes} */
    describe("#getNumberOfNodes", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        it("should return the number of nodes", function () {
            const r0 = g0.getNumberOfNodes();
            expect(r0).to.equal(2);
        });
    });

    /** @test {Graph#getNumberOfEdges} */
    describe("#getNumberOfEdges", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n0, n1);
        g0.addEdges([e0, e1]);

        it("should return the number of edges", function () {
            const r0 = g0.getNumberOfEdges();
            expect(r0).to.equal(2);
        });
    });

    /** @test {Graph#iterNodeIds} */
    describe("#iterNodeIds", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        it("should return all node IDs", function () {
            const r0 = [...g0.iterNodeIds()];
            expect(r0).to.contain(n0.id);
            expect(r0).to.contain(n1.id);
        });
    });

    /** @test {Graph#iterEdgeIds} */
    describe("#iterEdgeIds", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n0, n1);
        g0.addEdges([e0, e1]);

        it("should return all edge IDs", function () {
            let r0 = [...g0.iterEdgeIds()];
            expect(r0).to.contain(e0.id);
            expect(r0).to.contain(e1.id);
        });
    });

    /** @test {Graph#iterNodes} */
    describe("#iterNodes", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        it("should return all nodes in the graph (no extra parameters)", function () {
            const r0 = [...g0.iterNodes()];
            expect(r0).to.contain(n0);
            expect(r0).to.contain(n1);
            expect(r0.length).to.equal(2);
        });

        it("should return the selected nodes (given nodes parameter)", function () {
            const r0 = [...g0.iterNodes({
                nodes: n0.id
            })];
            expect(r0).to.contain(n0);
            expect(r0.length).to.equal(1);

            const r1 = [...g0.iterNodes({
                nodes: [n0.id, n1.id]
            })];
            expect(r1).to.contain(n0);
            expect(r1).to.contain(n1);
            expect(r1.length).to.equal(2);

            const r2 = [...g0.iterNodes({
                nodes: []
            })];
            expect(r2.length).to.equal(0);
        });

        it("should apply the function to all nodes (given map parameter)", function () {
            const r0 = [...g0.iterNodes({
                map: (n, g) => `${g.id}:${n.id}`
            })];
            expect(r0).to.contain(`${g0.id}:${n0.id}`);
            expect(r0).to.contain(`${g0.id}:${n1.id}`);
            expect(r0.length).to.equal(2);
        });

        it("should return all nodes that pass the test (given filter parameter)", function () {
            const r0 = [...g0.iterNodes({
                filter: (n, g) => n.id === n1.id
            })];
            expect(r0).to.contain(n1);
            expect(r0.length).to.equal(1);
        });
    });

    /** @test {Graph#iterEdges} */
    describe("#iterEdges", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node();
        g0.addNodes([n0, n1]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n0, n1);
        g0.addEdges([e0, e1]);

        it("should return all edges in the graph (no extra parameters)", function () {
            const r0 = [...g0.iterEdges()];
            expect(r0).to.contain(e0);
            expect(r0).to.contain(e1);
            expect(r0.length).to.equal(2);
        });

        it("should return the selected edges (given edges parameter)", function () {
            const r0 = [...g0.iterEdges({
                edges: e0.id
            })];
            expect(r0).to.contain(e0);
            expect(r0.length).to.equal(1);

            const r1 = [...g0.iterEdges({
                edges: [e0.id, e1.id]
            })];
            expect(r1).to.contain(e0);
            expect(r1).to.contain(e1);
            expect(r1.length).to.equal(2);

            const r2 = [...g0.iterEdges({
                edges: []
            })];
            expect(r2.length).to.equal(0);
        });

        it("should apply the function to all edges (given map parameter)", function () {
            const r0 = [...g0.iterEdges({
                map: (e, g) => `${g.id}:${e.id}`
            })];
            expect(r0).to.contain(`${g0.id}:${e0.id}`);
            expect(r0).to.contain(`${g0.id}:${e1.id}`);
            expect(r0.length).to.equal(2);
        });

        it("should return all edges that pass the test (given filter parameter)", function () {
            const r0 = [...g0.iterEdges({
                filter: (e, g) => e.id === e0.id
            })];
            expect(r0).to.contain(e0);
            expect(r0.length).to.equal(1);
        });
    });

    /** @test {Graph#generateMaximumSubgraphWith} */
    describe("#generateMaximumSubgraphWith", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node(),
                n2 = new Node(),
                n3 = new Node(),
                n4 = new Node();
        g0.addNodes([n0, n1, n2, n3, n4]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n1, n0),
                e2 = new Edge(n1, n2),
                e3 = new Edge(n3, n1),
                e4 = new Edge(n0, n4);
        g0.addEdges([e0, e1, e2, e3, e4]);

        it("should return a new graph with the given nodes and all edges between them", function() {
            const g1 = g0.generateMaximumSubgraphWith([n0, n1.id, n2]);

            const r0 = [...g1.iterNodes({
                map: (n, g) => n.parentId
            })];
            expect(r0).to.contain(n0.id);
            expect(r0).to.contain(n1.id);
            expect(r0).to.contain(n2.id);
            expect(r0.length).to.equal(3);

            const r1 = [...g1.iterEdges({
                map: (e, g) => e.parentId
            })];
            expect(r1).to.contain(e0.id);
            expect(r1).to.contain(e1.id);
            expect(r1).to.contain(e2.id);
            expect(r1.length).to.equal(3);
        });
    });

    /** @test {Graph#generateMinimumSubgraphWith} */
    describe("#generateMinimumSubgraphWith", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node(),
                n2 = new Node(),
                n3 = new Node(),
                n4 = new Node();
        g0.addNodes([n0, n1, n2, n3, n4]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n1, n0),
                e2 = new Edge(n1, n2),
                e3 = new Edge(n3, n1),
                e4 = new Edge(n0, n4);
        g0.addEdges([e0, e1, e2, e3, e4]);

        it("should return a new graph with the given edges and all incident nodes", function() {
            const g1 = g0.generateMinimumSubgraphWith([e0, e1, e2]);

            const r0 = [...g1.iterNodes({
                map: (n, g) => n.parentId
            })];
            expect(r0).to.contain(n0.id);
            expect(r0).to.contain(n1.id);
            expect(r0).to.contain(n2.id);
            expect(r0.length).to.equal(3);

            const r1 = [...g1.iterEdges({
                map: (e, g) => e.parentId
            })];
            expect(r1).to.contain(e0.id);
            expect(r1).to.contain(e1.id);
            expect(r1).to.contain(e2.id);
            expect(r1.length).to.equal(3);
        });
    });

    /** @test {Graph#iterDFSVisit} */
    describe("#iterDFSVisit", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node(),
                n2 = new Node(),
                n3 = new Node(),
                n4 = new Node(),
                n5 = new Node(),
                n6 = new Node();
        g0.addNodes([n0, n1, n2, n3, n4, n5, n6]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n1, n0),
                e2 = new Edge(n1, n2),
                e3 = new Edge(n3, n1),
                e4 = new Edge(n0, n4),
                e5 = new Edge(n4, n0),
                e6 = new Edge(n4, n5),
                e7 = new Edge(n5, n4);
        g0.addEdges([e0, e1, e2, e3, e4, e5, e6, e7]);

        it(`should visit all nodes reachable from the root in DFS order (direction="all")`, function () {
            const r0 = [...g0.iterDFSVisit(n0)];
            expect(r0).to.contain(n2);
            expect(r0).to.contain(n3);
            expect(r0.length).to.equal(6);

            expect(r0[0]).to.equal(n0);
            if (r0[1].id === n1.id) {
                expect(r0[4]).to.equal(n4);
                expect(r0[5]).to.equal(n5);
            } else {
                expect(r0[1]).to.equal(n4);
                expect(r0[2]).to.equal(n5);
                expect(r0[3]).to.equal(n1);
            }
        });

        it(`should visit all nodes reachable from the root in DFS order (direction="out")`, function () {
            const r0 = [...g0.iterDFSVisit(n0, "out")];
            expect(r0.length).to.equal(5);

            expect(r0[0]).to.equal(n0);
            if (r0[1].id === n1.id) {
                expect(r0[2]).to.equal(n2);
                expect(r0[3]).to.equal(n4);
                expect(r0[4]).to.equal(n5);
            } else {
                expect(r0[1]).to.equal(n4);
                expect(r0[2]).to.equal(n5);
                expect(r0[3]).to.equal(n1);
                expect(r0[4]).to.equal(n2);
            }
        });

        it(`should visit all nodes reachable from the root in DFS order (direction="inc")`, function () {
            const r0 = [...g0.iterDFSVisit(n0, "inc")];
            expect(r0.length).to.equal(5);

            expect(r0[0]).to.equal(n0);
            if (r0[1].id === n1.id) {
                expect(r0[2]).to.equal(n3);
                expect(r0[3]).to.equal(n4);
                expect(r0[4]).to.equal(n5);
            } else {
                expect(r0[1]).to.equal(n4);
                expect(r0[2]).to.equal(n5);
                expect(r0[3]).to.equal(n1);
                expect(r0[4]).to.equal(n3);
            }
        });
    });

    /** @test {Graph#iterBFSVisit} */
    describe("#iterBFSVisit", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node(),
                n2 = new Node(),
                n3 = new Node(),
                n4 = new Node(),
                n5 = new Node(),
                n6 = new Node();
        g0.addNodes([n0, n1, n2, n3, n4, n5, n6]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n1, n0),
                e2 = new Edge(n1, n2),
                e3 = new Edge(n3, n1),
                e4 = new Edge(n0, n4),
                e5 = new Edge(n4, n0),
                e6 = new Edge(n4, n5),
                e7 = new Edge(n5, n4);
        g0.addEdges([e0, e1, e2, e3, e4, e5, e6, e7]);

        it(`should visit all nodes reachable from the root in BFS order (direction="all")`, function () {
            const r0 = [...g0.iterBFSVisit(n0)];
            expect(r0[0]).to.equal(n0);
            expect([r0[1], r0[2]]).to.contain(n1);
            expect([r0[1], r0[2]]).to.contain(n4);
            expect([r0[3], r0[4], r0[5]]).to.contain(n2);
            expect([r0[3], r0[4], r0[5]]).to.contain(n3);
            expect([r0[3], r0[4], r0[5]]).to.contain(n5);
            expect(r0.length).to.equal(6);
        });

        it(`should visit all nodes reachable from the root in BFS order (direction="out")`, function () {
            const r0 = [...g0.iterBFSVisit(n0, "out")];
            expect(r0[0]).to.equal(n0);
            expect([r0[1], r0[2]]).to.contain(n1);
            expect([r0[1], r0[2]]).to.contain(n4);
            expect([r0[3], r0[4]]).to.contain(n2);
            expect([r0[3], r0[4]]).to.contain(n5);
            expect(r0.length).to.equal(5);
        });

        it(`should visit all nodes reachable from the root in BFS order (direction="inc")`, function () {
            const r0 = [...g0.iterBFSVisit(n0, "inc")];
            expect(r0[0]).to.equal(n0);
            expect([r0[1], r0[2]]).to.contain(n1);
            expect([r0[1], r0[2]]).to.contain(n4);
            expect([r0[3], r0[4]]).to.contain(n3);
            expect([r0[3], r0[4]]).to.contain(n5);
            expect(r0.length).to.equal(5);
        });
    });

    /** @test {Graph#computeBreadthFirstTree} */
    describe("#computeBreadthFirstTree", function () {
        const g0 = new Graph();

        const n0 = new Node(),
                n1 = new Node(),
                n2 = new Node(),
                n3 = new Node(),
                n4 = new Node(),
                n5 = new Node(),
                n6 = new Node();
        g0.addNodes([n0, n1, n2, n3, n4, n5, n6]);

        const e0 = new Edge(n0, n1),
                e1 = new Edge(n1, n0),
                e2 = new Edge(n1, n2),
                e3 = new Edge(n3, n1),
                e4 = new Edge(n0, n4),
                e5 = new Edge(n4, n0),
                e6 = new Edge(n4, n5),
                e7 = new Edge(n5, n4);
        g0.addEdges([e0, e1, e2, e3, e4, e5, e6, e7]);

        it(`should compute a breadth first tree (direction="all")`, function () {
            const r0 = g0.computeBreadthFirstTree(n0);
            expect(r0.rootId).to.equal(n0.id);
            expect(r0.getDistanceTo(n0)).to.equal(0);
            expect(r0.getDistanceTo(n1)).to.equal(1);
            expect(r0.getDistanceTo(n2)).to.equal(2);
            expect(r0.getDistanceTo(n3)).to.equal(2);
            expect(r0.getDistanceTo(n4)).to.equal(1);
            expect(r0.getDistanceTo(n5)).to.equal(2);
            expect(r0.getDistanceTo(n6)).to.be.undefined;

            const r1 = r0.getShortestPathTo(n5).toArray();
            expect(r1[0]).to.equal(n0.id);
            expect(r1[1]).to.equal(n4.id);
            expect(r1[2]).to.equal(n5.id);
        });

        it(`should compute a breadth first tree following only edges starting at a node (direction="out")`, function () {
            const r0 = g0.computeBreadthFirstTree(n0, "out");
            expect(r0.rootId).to.equal(n0.id);
            expect(r0.getDistanceTo(n0)).to.equal(0);
            expect(r0.getDistanceTo(n1)).to.equal(1);
            expect(r0.getDistanceTo(n2)).to.equal(2);
            expect(r0.getDistanceTo(n3)).to.be.undefined;
            expect(r0.getDistanceTo(n4)).to.equal(1);
            expect(r0.getDistanceTo(n5)).to.equal(2);
            expect(r0.getDistanceTo(n6)).to.be.undefined;

            const r1 = r0.getShortestPathTo(n5).toArray();
            expect(r1[0]).to.equal(n0.id);
            expect(r1[1]).to.equal(n4.id);
            expect(r1[2]).to.equal(n5.id);
        });

        it(`should compute a breadth first tree following only edges ending at a node (direction="inc")`, function () {
            const r0 = g0.computeBreadthFirstTree(n0, "inc");
            expect(r0.rootId).to.equal(n0.id);
            expect(r0.getDistanceTo(n0)).to.equal(0);
            expect(r0.getDistanceTo(n1)).to.equal(1);
            expect(r0.getDistanceTo(n2)).to.be.undefined;
            expect(r0.getDistanceTo(n3)).to.equal(2);
            expect(r0.getDistanceTo(n4)).to.equal(1);
            expect(r0.getDistanceTo(n5)).to.equal(2);
            expect(r0.getDistanceTo(n6)).to.be.undefined;

            const r1 = r0.getShortestPathTo(n3).toArray();
            expect(r1[0]).to.equal(n0.id);
            expect(r1[1]).to.equal(n1.id);
            expect(r1[2]).to.equal(n3.id);
        });
    });

    /** @test {Graph#addMethod} */
    describe("#addMethod", function () {
        const g0 = new Graph();

        it("should add a method to the graph", function () {
            g0[addMethod]("greet0", () => "Hello");
            expect(g0.greet0()).to.equal("Hello");
        });
    });

    /** @test {Graph#addPlugins} */
    describe("#addPlugins", function () {
        const g0 = new Graph();

        it("should call the register method of a plugin", function () {
            let r0;
            const p0 = {register: () => r0 = true};
            g0[addPlugin](p0);
            expect(r0).to.equal(true);
        });
    });

    /** @test {Graph#toString} */
    describe("#toString", function () {
        const g0 = new Graph();

        it("should return a string", function () {
            expect(g0.toString()).to.be.a("string");
        });
    });
});