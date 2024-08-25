import signLines from "../content/signContent.js";
import { dialogue } from "../ui/dialogue.js";

export function generateSignComponents(k, pos, tag) {
    return [
        k.sprite("assets", {
            anim: "sign"
        }),
        k.area({shape: new k.Rect(k.vec2(0), 16, 16)}),
        k.body({isStatic: true}),
        k.pos(pos),
        tag
    ];
}

export async function startSignInteraction(k, lines) {
    dialogue(k, k.vec2(250, 500), lines[0]);
}

