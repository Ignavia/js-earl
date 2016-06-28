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
        new Vec2(Math.random() + 0.01, Math.random() + 0.01) :
        vPos.sub(uPos);
    return {
        distance:  connection.length(),
        direction: connection.normalize(),
    };
}