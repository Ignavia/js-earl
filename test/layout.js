import {expect} from "chai";

import {Vec2}   from "@ignavia/ella";

import {Layout} from "../src/index.js";

describe("Layout", function () {
    beforeEach(function () {
        this.l = new Layout([
            ["n1", new Vec2(2, 0)],
            ["n2", new Vec2(1, 0)],
            ["n3", new Vec2(1, 1)]
        ]);
    });

    describe("#fromJSON", function () {
        it("should convert a plain object to a layout", function () {
            const o = {
                "n1": {x: 1, y: 0},
                "n2": {x: 2, y: 3},
            };
            const r     = Layout.fromJSON(o);
            const n1Pos = r.getPosition("n1");
            expect(n1Pos.x).to.equal(1);
            expect(n1Pos.y).to.equal(0);
            expect(n1Pos).to.be.an.instanceof(Vec2);
        });
    });

    describe("#constructor", function () {
        it("should set the initial positions", function () {
            const pos1 = this.l.getPosition("n1");
            expect(pos1.x).to.equal(2);
            expect(pos1.y).to.equal(0);

            const pos2 = this.l.getPosition("n2");
            expect(pos2.x).to.equal(1);
            expect(pos2.y).to.equal(0);

            const pos3 = this.l.getPosition("n3");
            expect(pos3.x).to.equal(1);
            expect(pos3.y).to.equal(1);
        });
    });

    describe("#moveNodeTo", function () {
        it("should move a node", function () {
            this.l.moveNodeTo("n1", new Vec2(3, 1));

            const pos1 = this.l.getPosition("n1");
            expect(pos1.x).to.equal(3);
            expect(pos1.y).to.equal(1);
        });
    });

    describe("#moveNodeBy", function () {
        it("should move a node", function () {
            this.l.moveNodeBy("n1", new Vec2(1, 1));

            const pos1 = this.l.getPosition("n1");
            expect(pos1.x).to.equal(3);
            expect(pos1.y).to.equal(1);
        });
    });

    describe("#moveAllBy", function () {
        it("should move the layout", function () {
            this.l.moveAllBy(new Vec2(1, 1));

            const pos1 = this.l.getPosition("n1");
            expect(pos1.x).to.equal(3);
            expect(pos1.y).to.equal(1);

            const pos2 = this.l.getPosition("n2");
            expect(pos2.x).to.equal(2);
            expect(pos2.y).to.equal(1);
        });
    });

    describe("#scaleAll", function () {
        it("should scale the layout", function () {
            this.l.scaleAll(2, 3, new Vec2(1, 0));

            const pos1 = this.l.getPosition("n1");
            expect(pos1.x).to.equal(3);
            expect(pos1.y).to.equal(0);

            const pos2 = this.l.getPosition("n2");
            expect(pos2.x).to.equal(1);
            expect(pos2.y).to.equal(0);

            const pos3 = this.l.getPosition("n3");
            expect(pos3.x).to.equal(1);
            expect(pos3.y).to.equal(3);
        });
    });

    describe("#rotateAll", function () {
        it("should rotate the layout", function () {
            this.l.rotateAll(Math.PI, new Vec2(1, 0));

             const pos1 = this.l.getPosition("n1");
            expect(pos1.x).to.be.closeTo(0, Number.EPSILON);
            expect(pos1.y).to.be.closeTo(0, Number.EPSILON);

            const pos2 = this.l.getPosition("n2");
            expect(pos2.x).to.be.closeTo(1, Number.EPSILON);
            expect(pos2.y).to.be.closeTo(0, Number.EPSILON);

            const pos3 = this.l.getPosition("n3");
            expect(pos3.x).to.be.closeTo(1, Number.EPSILON);
            expect(pos3.y).to.be.closeTo(-1, Number.EPSILON);
        });
    });

    describe("#toJSON", function () {
        it("should convert the layout into a plain object", function () {
            const r = this.l.toJSON();
            expect(r.n1.x).to.equal(2);
            expect(r.n1.y).to.equal(0);
        });
    });

    after(function () {
        delete this.l;
    });
});
