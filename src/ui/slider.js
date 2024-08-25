import { gameState, playerState } from "../state/stateManager.js";
import { healthBar } from "./healthBar.js";
import { stats } from "./stats.js";

export async function sliderUI(k, player) {
    const sliderUI = k.add([
        k.pos(20, 80),
        k.fixed(),
        "sliderUI"
    ]);

    if (playerState.getScale() === 1) {
        sliderUI.add([k.sprite("scale-one"), k.pos(0, 0), k.scale(4)]);
    } if (playerState.getScale() === 2) {
        sliderUI.add([k.sprite("scale-two"), k.pos(0, 0), k.scale(4)]);
    } if (playerState.getScale() === 3) {
        sliderUI.add([k.sprite("scale-three"), k.pos(0, 0), k.scale(4)]);
    }

    if (gameState.getLoc() === "one") {
        if (playerState.getScale() === 1) {
            player.attackPower = 0.5;
            player.attackDelay = 0.1;
        } if (playerState.getScale() === 2) {
            player.attackPower = 1;
            player.attackDelay = 0.25;
        } if (playerState.getScale() === 3) {
            player.attackPower = 2;
            player.attackDelay = 0.75;
        }
    } if (gameState.getLoc() === "two") {
        if (playerState.getScale() === 1) {
            player.visibility = 30;
        } if (playerState.getScale() === 2) {
            player.visibility = 50;
        } if (playerState.getScale() === 3) {
            player.visibility = 70;
        }
    } if (gameState.getLoc() === "three") {
        if (playerState.getScale() === 1) {
            k.tween(
                player.cameraScale,
                4,
                0.15,
                (newPos) => {
                    k.camScale(newPos);
                },
                k.easings.easeInOutQuad
            );
            player.cameraScale = 4;
        } if (playerState.getScale() === 2) {
            k.tween(
                player.cameraScale,
                2.5,
                0.15,
                (newPos) => {
                    k.camScale(newPos);
                },
                k.easings.easeInOutQuad
            );
            player.cameraScale = 2.5;
        } if (playerState.getScale() === 3) {
            k.tween(
                player.cameraScale,
                1,
                0.15,
                (newPos) => {
                    k.camScale(newPos);
                },
                k.easings.easeInOutQuad
            );
            player.cameraScale = 1;
        }
    } if (gameState.getLoc() === "four") {
        if (playerState.getScale() === 1) {
            player.speed = 125;
            playerState.setMaxHealth(2);
        } if (playerState.getScale() === 2) {
            player.speed = 100;
            playerState.setMaxHealth(3);
        } if (playerState.getScale() === 3) {
            player.speed = 75;
            playerState.setMaxHealth(4);
        }
    }

    k.destroyAll("healthContainer");
    healthBar(k);
    stats(k, player);
    return sliderUI;
}
