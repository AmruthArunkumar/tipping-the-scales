import { gameState, playerState } from "../state/stateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { sliderUI } from "../ui/slider.js";
import { areAnyOfTheseKeysDown, playAnimIfNotPlaying } from "../utils.js";

export function generatePlayerComponents(k, pos) {
    return [
        k.sprite("assets", {
            anim: "player-idle-down"
        }),
        k.area({shape: new k.Rect(k.vec2(3, 4), 10, 12)}),
        k.body(),
        k.pos(pos),
        k.opacity(),
        {
            speed: 100, // 75, 100, 125
            attackPower: 1, // 0.5, 1, 2
            attackDelay: 0.25, // 0.1, 0.25, 0.75
            visibility: 50, // 30, 50, 70
            cameraScale: 4, // 1, 2.5, 4
            direction: "down",
            isAttacking: false
        },
        "player"
    ];
}

export function setPlayerScaleChange(k, player) {
    k.onKeyPress((key) => {
        let possibleChange = playerState.getScale();
        if (key === "z" && !areAnyOfTheseKeysDown(k, ["x"])) {
            playerState.setScale(possibleChange === 1 ? possibleChange : possibleChange - 1);
            if (gameState.getLastStat() !== "") {k.destroy(gameState.getLastStat())}
            if (gameState.getLastHealth() !== "") {k.destroy(gameState.getLastHealth())}
            k.destroyAll("healthContainer");
            k.destroyAll("sliderUI");
            sliderUI(k, player);
            return;
        } if (key === "x" && !areAnyOfTheseKeysDown(k, ["z"])) {
            playerState.setScale(possibleChange === 3 ? possibleChange : possibleChange + 1);
            if (gameState.getLastStat() !== "") {k.destroy(gameState.getLastStat())}
            if (gameState.getLastHealth() !== "") {k.destroy(gameState.getLastHealth())}
            k.destroyAll("healthContainer");
            k.destroyAll("sliderUI");
            sliderUI(k, player);
            return;
        }
    });
}

export function setPlayerMovement(k, player) {
    k.onKeyDown((key) => {
        if (gameState.getFreezePlayer()) return;
        if (key === "left" && !areAnyOfTheseKeysDown(k, ["up", "down"])) {
            player.flipX = true;
            playAnimIfNotPlaying(player, "player-side");
            player.move(-player.speed, 0);
            player.direction = "left";
            return;
        } if (key === "right" && !areAnyOfTheseKeysDown(k, ["up", "down"])) {
            player.flipX = false;
            playAnimIfNotPlaying(player, "player-side");
            player.move(player.speed, 0);
            player.direction = "right";
            return;
        } if (key === "up") {
            playAnimIfNotPlaying(player, "player-up");
            player.move(0, -player.speed);
            player.direction = "up";
            return;
        } if (key === "down") {
            playAnimIfNotPlaying(player, "player-down");
            player.move(0, player.speed);
            player.direction = "down";
            return;
        }
    });

    k.onKeyPress((key) => {
        if (player.isAttacking) return;
        if (key !== "space") return;
        if (gameState.getFreezePlayer()) return;
        if (!playerState.getIsSwordEquipped()) return;

        player.isAttacking = true;

        if (k.get("swordHitBox").length === 0) {
            const swordHitBoxPosX = {
                left: player.worldPos().x - 2,
                right: player.worldPos().x + 10,
                up: player.worldPos().x + 5,
                down: player.worldPos().x + 2,
            };

            const swordHitBoxPosY = {
                left: player.worldPos().y + 5,
                right: player.worldPos().y + 5,
                up: player.worldPos().y,
                down: player.worldPos().y + 10,
            };

            k.add([
                k.area({shape: new k.Rect(k.vec2(0), 8, 8)}),
                k.pos(swordHitBoxPosX[player.direction], swordHitBoxPosY[player.direction]),
                "swordHitBox"
            ]);

            k.wait(0.1, () => {
                k.destroyAll("swordHitBox");
                if (player.direction === "left" || player.direction === "right") {
                    playAnimIfNotPlaying(player, "player-side");
                    player.stop();
                    return;
                }
                playAnimIfNotPlaying(player, `player-${player.direction}`);
                player.stop();
            });
        }
        playAnimIfNotPlaying(player, `player-attack-${player.direction}`);
        k.wait(player.attackDelay, () => {player.isAttacking = false;})
    });

    k.onKeyRelease(() => {
        player.stop();
    });
}

