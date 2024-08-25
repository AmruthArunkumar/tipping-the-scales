import { gameState, playerState } from "../state/stateManager.js";
import { displayStats } from "./dialogue.js";

export async function stats(k, player) {
    const statsBox = k.add([k.rect(300, 400), k.pos(20, 150), k.fixed(), k.opacity(0)]);
    const stats = statsBox.add([
        k.text("", {
            font: "silkscreen",
            width: 700,
            lineSpacing: 15,
            size: gameState.getFontSize() - 8
        }),
        gameState.getLoc() === "two" || gameState.getLoc() === "one" ? k.color(255, 255, 255) : k.color(27, 29, 52),
        k.pos(5, 5),
        k.fixed()
    ]);

    if (gameState.getLoc() === "one") {
        await displayStats(stats, "Attack Power: " + player.attackPower + "\nCooldown: " + player.attackDelay + " (sec)");
    } if (gameState.getLoc() === "two") {
        await displayStats(stats, "Visibility: " + player.visibility);
    } if (gameState.getLoc() === "three") {
        await displayStats(stats, "Camera Scale: " + player.cameraScale);
    } if (gameState.getLoc() === "four") {
        await displayStats(stats, "Max Health: " + playerState.getMaxHealth() + "\nSpeed: " + player.speed);
    }

    gameState.setLastStat(statsBox);
    return statsBox;
}
