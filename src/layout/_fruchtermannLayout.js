import {Vec2, Vec2Builder} from "@ignavia/ella";

import randomLayout from "./randomLayout";

function idealDistance(graph, width, height, idealDistanceCoef) {
    return idealDistanceCoef * Math.sqrt(width * height / graph.getNumberOfNodes());
}

function attractiveForce(distance, idealDistance) {
    return distance**2 / idealDistance;
}

function repulsiveForce(distance, idealDistance) {
    return -(idealDistance**2) / distance;
}

function computeRepulsiveForces(graph, layout, idealDistance) {
    const result = new Map();

    for (let u of graph.iterNodes()) {
        result.set(u.id, new Vec2Builder(0, 0));
        const uPos = layout.get(u.id);
        for (let v of graph.iterNodes()) {
            if (u === v) {
                continue;
            }
            const vPos = layout.get(v.id);
            const connection = vPos.sub(uPos);

            const distance = connection.length();
            const direction = connection.normalize();
            const magnitude = repulsiveForce(distance, idealDistance);

            const change = direction.mul(magnitude);

            const oldDisp = result.get(u.id);
            oldDisp.add(change);
        }
    }
    return result;
}

function computeAttractiveForces(graph, layout, disp, idealDistance) {
    for (let e of graph.iterEdges()) {
        const u = e.sourceId;
        const v = e.targetId;

        const uPos = layout.getPosition(u);
        const vPos = layout.getPosition(v);

        const connection = vPos.sub(uPos);

        const distance = connection.length();
        const direction = connection.normalize();
        const magnitude = attractiveForce(distance, idealDistance);

        const change = direction.mul(magnitude);

        const oldUDisp = disp.get(u);
        oldUDisp.add(change);

        const oldVDisp = disp.get(v);
        oldVDisp.sub(change);
    }
}

function computeDisplacements(graph, layout, idealDistance) {
    const result = computeRepulsiveForces(graph, layout, idealDistance);
    computeAttractiveForces(graph, layout, result, idealDistance);

    return result;
}

function moveNodes() {

}

function cool(initialTemperature, nSteps, step) {
    return initialTemperature * (1 - step / nSteps);
}

export default function(graph, {
        pos                 = new Vec2(0, 0),
        width               = 1920,
        height              = 1080,
        idealDistanceCoef   = 1,
        initialTemperature  = width / 10,
    } = {}) {

    const result      = randomLayout(graph, { pos, width, height });
    const idealDist   = idealDistance(graph, width, height, idealDistanceCoef);
    let   temperature = initialTemperature;

    for (let i = 1; i <= nSteps; i++) {
        const displacements = computeDisplacements(graph, result, idealDistance);
        moveNodes(layout, displacements, pos, width, height, temperature);
        temperature = cool(initialTemperature, nSteps, i);
    }

    return result;
}

/*


{calculate repulsive forces}
for v in V do begin
{each vertex has two vectors: .pos and .disp
v.disp := 0;
for u in V do
if (u 6= v) then begin
{δ is the difference vector between the positions of the two vertices}
δ := v.pos − u.pos;
v.disp := v.disp + (δ/|δ|) ∗ fr(|δ|)
end
end
{calculate attractive forces}
for e in E do begin
{each edges is an ordered pair of vertices .vand.u}
δ := e.v.pos − e.u.pos;
e.v.disp := e.v.disp − (δ/|δ|) ∗ fa(|δ|);
e.u.disp := e.u.disp + (δ/|δ|) ∗ fa(|δ|)
end
{limit max displacement to temperature t and prevent from displacement
outside frame}
for v in V do begin
v.pos := v.pos + (v.disp/|v.disp|) ∗ min(v.disp, t);
v.pos.x := min(W/2, max(−W/2, v.pos.x));
v.pos.y := min(L/2, max(−L/2, v.pos.y))
end
{reduce the temperature as the layout approaches a better configuration}
t := cool(t)
end
*/