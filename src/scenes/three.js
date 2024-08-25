import { generateGhostComponents, setGhostAI } from "../entities/ghost.js";
import { generatePlayerComponents, setPlayerMovement, setPlayerScaleChange } from "../entities/player.js";
import { generateSlimeComponents, setSlimeAI } from "../entities/slime.js";
import { gameState, playerState } from "../state/stateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { sliderUI } from "../ui/slider.js";
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData, onAttacked, onCollideWithPlayer } from "../utils.js";

export default async function three(k) {
    colorizeBackground(k, 76, 170, 255);
    const mapData = await fetchMapData("./assets/maps/three.json");

    const map = k.add([k.pos(0, 0)]);

    const entities = {
        player: null,
        slimes: [],
        ghosts: []
    };

    const layers = mapData.layers;
    for (const layer of layers) {
        if (layer.name === "Boundaries") {
            drawBoundaries(k, map, layer);
            continue;
        } if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if (object.name === "player") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "slime") {
                    entities.slimes.push(map.add(generateSlimeComponents(k, k.vec2(object.x, object.y))));
                    continue;
                } if (object.name === "ghost") {
                    entities.ghosts.push(map.add(generateGhostComponents(k, k.vec2(object.x, object.y))));
                    continue;
                }
            }
            continue;
        }
        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    playerState.setScale(1);
    k.camScale(entities.player.cameraScale);
    k.camPos(entities.player.worldPos());
    k.onUpdate(() => {
        if (entities.player.pos.dist(k.camPos())) {
            k.tween(
                k.camPos(),
                entities.player.worldPos(),
                0.15,
                (newPos) => {
                    k.camPos(newPos);
                },
                k.easings.linear
            );
        }
    });

    healthBar(k);
    sliderUI(k, entities.player);

    setPlayerMovement(k, entities.player);
    setPlayerScaleChange(k, entities.player);
    playerState.setIsSwordEquipped(true);

    for (const slime of entities.slimes) {
        setSlimeAI(k, slime);
        onAttacked(k, slime, entities.player);
        onCollideWithPlayer(k, slime);
    }

    for (const ghost of entities.ghosts) {
        setGhostAI(k, ghost, entities.player);
        onAttacked(k, ghost, entities.player);
        onCollideWithPlayer(k, ghost);
    }

    entities.player.onCollide("back-to-house", () => {
        playerState.setHealth(playerState.getMaxHealth());
        gameState.setLoc("house");
        gameState.setPrevLoc("three");
        k.go("house");
    });
}
