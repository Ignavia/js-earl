import {Vec2} from "@ignavia/ella";

import translate from "./translate.js";

export default function(layout, angle, center = new Vec2(0, 0)) {
    translate(layout, center.mul(-1));
    for (let [id, position] of layout) {
        layout.set(id, position.rotate(angle));
    }
    translate(layout, center);
}