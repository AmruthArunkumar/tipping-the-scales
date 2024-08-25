import oldmanLines from "../content/oldmanDialogue.js";
import { dialogue } from "../ui/dialogue.js";
import { playAnimIfNotPlaying } from "../utils.js";

export function generateOldManComponents(k, pos) {
    return [
        k.sprite("assets", {
            anim: "oldman-down"
        }),
        k.area({shape: new k.Rect(k.vec2(2, 4), 12, 12)}),
        k.body({isStatic: true}),
        k.pos(pos),
        "oldman"
    ];
}

export async function startInteraction(k, oldman, player) {
    if (player.direction === "left") {
        oldman.flipX = true;
        playAnimIfNotPlaying(oldman, "oldman-side");
    } if (player.direction === "right") {
        oldman.flipX = false;
        playAnimIfNotPlaying(oldman, "oldman-side");
    } if (player.direction === "up") {
        playAnimIfNotPlaying(oldman, "oldman-down");
    } if (player.direction === "down") {
        playAnimIfNotPlaying(oldman, "oldman-up");
    }
    const responses = oldmanLines.english;

    dialogue(k, k.vec2(250, 500), responses[0]);
}

