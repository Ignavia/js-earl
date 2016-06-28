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

/**
 * Adds some random wiggle to the node positions if they are equal.
 *
 * @return {number}
 * A random number between -1 and 1, excluding 0.
 */
function randomWiggle() {
    let result;

    do {
        result = Math.random() - Math.random();
    } while (result === 0);

    return result;
}