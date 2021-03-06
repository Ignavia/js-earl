import {expect} from "chai";

import {Graph, Node, Edge} from "../src/index.js";

describe("Node", function () {
    describe("#fromJSON", function () {
        it("should convert a plain JSON object back to a Node object", function () {
            const r = Node.fromJSON(new Node("n0").toJSON());
            expect(r.id).to.equal("n0");
        });
    });

    describe("#constructor", function () {
        const n0 = new Node(),
              n1 = new Node();

        it("should set node IDs", function () {
            expect(n0.id).to.be.a("string");
            expect(n1.id).to.be.a("string");
            expect(n0.id).to.not.equal(n1.id);
        });
    });

    describe("#iterAdjacentNodes", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        const n3 = new Node();
        g0.addNodes(n0, n1, n2, n3);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return the IDs of all adjacent nodes (direction="all")`, function () {
            const r0 = [...n1.iterAdjacentNodes("all")];
            expect(r0).to.have.members([n0.id, n2.id]);

            const r1 = [...n0.iterAdjacentNodes()];
            expect(r1).to.not.contain(n2.id);

            const r2 = [...n3.iterAdjacentNodes()];
            expect(r2).to.be.empty;
        });

        it(`should return the IDs of outgoing adjacent nodes (direction="out")`, function () {
            const r0 = [...n1.iterAdjacentNodes("out")];
            expect(r0).to.have.members([n2.id]);

            const r1 = [...n0.iterAdjacentNodes("out")];
            expect(r1).to.not.contain(n2.id);

            const r2 = [...n3.iterAdjacentNodes("out")];
            expect(r2).to.be.empty;
        });

        it(`should return the IDs of incoming adjacent nodes (direction="inc")`, function () {
            const r0 = [...n1.iterAdjacentNodes("inc")];
            expect(r0).to.have.members([n0.id]);

            const r1 = [...n0.iterAdjacentNodes("inc")];
            expect(r1).to.not.contain(n2.id);

            const r2 = [...n3.iterAdjacentNodes("inc")];
            expect(r2).to.be.empty;
        });
    });

    describe("#getNumberOfAdjacentNodes", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        g0.addNodes(n0, n1, n2);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        const e4 = new Edge(n1, n0);
        g0.addEdges(e0, e1, e2, e3, e4);
        g0.removeEdges(e2, e3);

        it(`should return the number of adjacent nodes (direction="all")`, function () {
            const r0 = n1.getNumberOfAdjacentNodes("all");
            expect(r0).to.equal(2);

            const r1 = n0.getNumberOfAdjacentNodes();
            expect(r1).to.equal(1);
        });

        it(`should return the number of outgoing adjacent nodes (direction="out")`, function () {
            const r0 = n1.getNumberOfAdjacentNodes("out");
            expect(r0).to.equal(2);

            const r1 = n0.getNumberOfAdjacentNodes("out");
            expect(r1).to.equal(1);
        });

        it(`should return the number of incoming adjacent nodes (direction="inc")`, function () {
            const r0 = n1.getNumberOfAdjacentNodes("inc");
            expect(r0).to.equal(1);

            const r1 = n0.getNumberOfAdjacentNodes("inc");
            expect(r1).to.equal(1);
        });
    });

    describe("#isAdjacentNode", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        g0.addNodes(n0, n1, n2);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return if the node is adjacent (direction="all")`, function () {
            const r0 = n1.isAdjacentNode(n0, "all");
            expect(r0).to.equal(true);

            const r1 = n1.isAdjacentNode(n1);
            expect(r1).to.equal(false);

            const r2 = n1.isAdjacentNode(n2.id);
            expect(r2).to.equal(true);

            const r3 = n0.isAdjacentNode(n2.id);
            expect(r3).to.equal(false);
        });

        it(`should return if the node is outgoing adjacent (direction="out")`, function () {
            const r0 = n1.isAdjacentNode(n0, "out");
            expect(r0).to.equal(false);

            const r1 = n1.isAdjacentNode(n2, "out");
            expect(r1).to.equal(true);

            const r2 = n0.isAdjacentNode(n2, "out");
            expect(r2).to.equal(false);
        });

        it(`should return if the node is incoming adjacent (direction="inc")`, function () {
            const r0 = n1.isAdjacentNode(n0, "inc");
            expect(r0).to.equal(true);

            const r1 = n1.isAdjacentNode(n2, "inc");
            expect(r1).to.equal(false);

            const r2 = n0.isAdjacentNode(n2, "inc");
            expect(r2).to.equal(false);
        });
    });

    describe("#iterEdgesBetween", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        g0.addNodes(n0, n1, n2);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return the IDs of the edges between the two nodes (direction="all")`, function () {
            const r0 = [...n1.iterEdgesBetween(n0, "all")];
            expect(r0).to.have.members([e0.id]);

            const r1 = [...n1.iterEdgesBetween(n2.id)];
            expect(r1).to.have.members([e1.id]);

            const r3 = [...n0.iterEdgesBetween(n2)];
            expect(r3).to.be.empty;
        });

        it(`should return the IDs of the edges starting at this node and ending at the given one (direction="out")`, function () {
            const r0 = [...n1.iterEdgesBetween(n0, "out")];
            expect(r0.length).to.equal(0);

            const r1 = [...n1.iterEdgesBetween(n2, "out")];
            expect(r1).to.have.members([e1.id]);

            const r2 = [...n0.iterEdgesBetween(n2, "out")];
            expect(r2).to.be.empty;
        });

        it(`should return the IDs of the edges starting at the given node and ending at this one (direction="inc")`, function () {
            const r0 = [...n1.iterEdgesBetween(n0, "inc")];
            expect(r0).to.have.members([e0.id]);

            const r1 = [...n1.iterEdgesBetween(n2, "inc")];
            expect(r1).to.be.empty;

            const r2 = [...n0.iterEdgesBetween(n2, "inc")];
            expect(r2).to.be.empty;
        });
    });

    describe("#getNumberOfEdgesBetween", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        g0.addNodes(n0, n1, n2);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return the number of edges between the two nodes (direction="all")`, function () {
            const r0 = n1.getNumberOfEdgesBetween(n0, "all");
            expect(r0).to.equal(1);

            const r1 = n0.getNumberOfEdgesBetween(n2);
            expect(r1).to.equal(0);
        });

        it(`should return the number of edges starting at this node and ending at the given one (direction="out")`, function () {
            const r0 = n1.getNumberOfEdgesBetween(n0, "out");
            expect(r0).to.equal(0);

            const r1 = n0.getNumberOfEdgesBetween(n2, "out");
            expect(r1).to.equal(0);
        });

        it(`should return the number of edges starting at the given node and ending at this one (direction="inc")`, function () {
            const r0 = n1.getNumberOfEdgesBetween(n0, "inc");
            expect(r0).to.equal(1);

            const r1 = n0.getNumberOfEdgesBetween(n2, "inc");
            expect(r1).to.equal(0);
        });
    });

    describe("#isEdgeBetween", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        g0.addNodes(n0, n1, n2);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return if the edge is between the two nodes (direction="all")`, function () {
            const r0 = n1.isEdgeBetween(n0, e0, "all");
            expect(r0).to.equal(true);

            const r1 = n1.isEdgeBetween(n2.id, e1.id);
            expect(r1).to.equal(true);

            const r2 = n2.isEdgeBetween(n0, e1);
            expect(r2).to.equal(false);

            const r3 = n0.isEdgeBetween(n2, e2);
            expect(r3).to.equal(false);

            const r4 = n0.isEdgeBetween(n2, e3);
            expect(r4).to.equal(false);
        });

        it(`should return if the edge starts at this node and ends at the given one (direction="out")`, function () {
            const r0 = n1.isEdgeBetween(n0, e0, "out");
            expect(r0).to.equal(false);

            const r1 = n1.isEdgeBetween(n2, e1, "out");
            expect(r1).to.equal(true);

            const r2 = n0.isEdgeBetween(n2, e2, "out");
            expect(r2).to.equal(false);
        });

        it(`should return if the edge starts at the given node and ends at this one (direction="inc")`, function () {
            const r0 = n1.isEdgeBetween(n0, e0, "inc");
            expect(r0).to.equal(true);

            const r1 = n1.isEdgeBetween(n2, e1, "inc");
            expect(r1).to.equal(false);

            const r2 = n0.isEdgeBetween(n2, e3, "inc");
            expect(r2).to.equal(false);
        });
    });

    describe("#iterIncidentEdges", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        const n3 = new Node();
        g0.addNodes(n0, n1, n2, n3);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return the IDs of all incident edges (direction="all")`, function () {
            const r0 = [...n1.iterIncidentEdges("all")];
            expect(r0).to.have.members([e0.id, e1.id]);

            const r1 = [...n0.iterIncidentEdges()];
            expect(r1).to.not.contain(n2.id);

            const r2 = [...n3.iterIncidentEdges()];
            expect(r2).to.be.empty;
        });

        it(`should return the IDs of outgoing edges (direction="out")`, function () {
            const r0 = [...n1.iterIncidentEdges("out")];
            expect(r0).to.have.members([e1.id]);

            const r1 = [...n0.iterIncidentEdges("out")];
            expect(r1).to.not.contain(n2.id);

            const r2 = [...n3.iterIncidentEdges("out")];
            expect(r2).to.be.empty;
        });

        it(`should return the IDs of incoming edges (direction="inc")`, function () {
            const r0 = [...n1.iterIncidentEdges("inc")];
            expect(r0).to.have.members([e0.id]);

            const r1 = [...n0.iterIncidentEdges("inc")];
            expect(r1).to.not.contain(n2.id);

            const r2 = [...n3.iterIncidentEdges("inc")];
            expect(r2).to.be.empty;
        });
    });

    describe("#getNumberOfIncidentEdges", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        const n3 = new Node();
        g0.addNodes(n0, n1, n2, n3);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return the IDs of all adjacent nodes (direction="all")`, function () {
            const r0 = n1.getNumberOfIncidentEdges("all");
            expect(r0).to.equal(2);

            const r1 = n0.getNumberOfIncidentEdges();
            expect(r1).to.equal(1);
        });

        it(`should return the IDs of outgoing adjacent nodes (direction="out")`, function () {
            const r0 = n1.getNumberOfIncidentEdges("out");
            expect(r0).to.equal(1);

            const r1 = n0.getNumberOfIncidentEdges("out");
            expect(r1).to.equal(1);
        });

        it(`should return the IDs of incoming adjacent nodes (direction="inc")`, function () {
            const r0 = n1.getNumberOfIncidentEdges("inc");
            expect(r0).to.equal(1);

            const r1 = n0.getNumberOfIncidentEdges("inc");
            expect(r1).to.equal(0);
        });
    });

    describe("#isIncidentEdge", function () {
        const g0 = new Graph();

        const n0 = new Node();
        const n1 = new Node();
        const n2 = new Node();
        const n3 = new Node();
        g0.addNodes(n0, n1, n2, n3);

        const e0 = new Edge(n0, n1);
        const e1 = new Edge(n1, n2);
        const e2 = new Edge(n0, n2);
        const e3 = new Edge(n2, n0);
        g0.addEdges(e0, e1, e2, e3);
        g0.removeEdges(e2, e3);

        it(`should return if the edge is incident (direction="all")`, function () {
            const r0 = n1.isIncidentEdge(e0, "all");
            expect(r0).to.equal(true);

            const r1 = n1.isIncidentEdge(e1.id);
            expect(r1).to.equal(true);

            const r2 = n2.isIncidentEdge(e0);
            expect(r2).to.equal(false);

            const r3 = n0.isIncidentEdge(e2);
            expect(r3).to.equal(false);

            const r4 = n0.isIncidentEdge(e3);
            expect(r4).to.equal(false);
        });

        it(`should return if the edge is outgoing (direction="out")`, function () {
            const r0 = n1.isIncidentEdge(e0, "out");
            expect(r0).to.equal(false);

            const r1 = n1.isIncidentEdge(e1, "out");
            expect(r1).to.equal(true);

            const r2 = n0.isIncidentEdge(e2, "out");
            expect(r2).to.equal(false);
        });

        it(`should return if the edge is incoming (direction="inc")`, function () {
            const r0 = n1.isIncidentEdge(e0, "inc");
            expect(r0).to.equal(true);

            const r1 = n1.isIncidentEdge(e1, "inc");
            expect(r1).to.equal(false);

            const r2 = n0.isIncidentEdge(e3, "inc");
            expect(r2).to.equal(false);
        });
    });

    describe("#toString", function () {
        const g0 = new Graph();

        const n0 = new Node();
        g0.addNodes(n0);

        it("should return a string", function () {
            expect(n0.toString()).to.be.a("string");
        });
    });

    describe("#toJSON", function() {
        it("should encode all information to reconstruct the node object", function () {
            const r = new Node("n0").toJSON();
            expect(r.id).to.equal("n0");
        });
    });
});
