import {Vec2} from "@ignavia/ella";

/**
 * Computes the distance between the two points and a normalized direction
 * vector from the first to the second.
 *
 * @param {Vec2} uPos
 * The first position.
 *
 * @param {Vec2} vPos
 * The second position.
 *
 * @return {Object}
 * The distance and direction.
 *
 * @private
 */
export function computeConnection(uPos, vPos) {
    const connection = uPos.equals(vPos) ?
        new Vec2(randomWiggle(), randomWiggle()) :
        vPos.sub(uPos);
    return {
        distance:  connection.length(),
        direction: connection.normalize(),
    };
}

function randomWiggle() {
    let result;

    do {
        result = Math.random() - Math.random();
    } while (result === 0);

    return result;
}