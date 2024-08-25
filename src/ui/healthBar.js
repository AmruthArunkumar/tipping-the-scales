import { gameState, playerState } from "../state/stateManager.js";

export function healthBar(k) {
    let numFullHearts = Math.floor(playerState.getHealth());
    let addHalfHeart = false;

    if (playerState.getHealth() - numFullHearts === 0.5) {
        addHalfHeart = true;
    }

    let numEmptyHearts = playerState.getMaxHealth() - numFullHearts - (addHalfHeart ? 1 : 0);

    const heartsContainer = k.add([
        k.pos(20, 20),
        k.fixed(),
        "healthContainer"
    ]);

    let previousX = 0;
    for (let i = 0; i < numFullHearts; i++) {
        heartsContainer.add([k.sprite("full-heart"), k.pos(previousX, 0)]);
        previousX += 48;
    }

    if (addHalfHeart) {
        heartsContainer.add([k.sprite("half-heart"), k.pos(previousX, 0)]);
        previousX += 48;
    }

    if (numEmptyHearts > 0) {
        for (let i = 0; i < numEmptyHearts; i++) {
            heartsContainer.add([k.sprite("empty-heart"), k.pos(previousX, 0)]);
            previousX += 48;
        }
    }

    gameState.setLastHealth(heartsContainer);
    return heartsContainer;
}
