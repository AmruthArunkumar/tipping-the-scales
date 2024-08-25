import { generateDarkGhostComponents, setGhostAI } from "../entities/ghost.js";
import { generatePlayerComponents, setPlayerMovement, setPlayerScaleChange } from "../entities/player.js";
import { generateDarkSlimeComponents, generateSlimeComponents, setSlimeAI } from "../entities/slime.js";
import { gameState, playerState } from "../state/stateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { sliderUI } from "../ui/slider.js";
import { colorizeBackground, drawBoundaries, drawDarkRoomTiles, drawTiles, fetchMapData, onAttacked, onCollideWithPlayer } from "../utils.js";

export default async function two(k) {
    colorizeBackground(k, 27, 29, 52);
    const mapData = await fetchMapData("./assets/maps/two.json");

    const map = k.add([k.pos(0, 0)]);

    const entities = {
        player: null,
        slimes: [],
        ghosts: []
    };

    let darkEntities = []
    let darkEnemies = []

    const layers = mapData.layers;
    let initialPlayerPos = null;

    for (const layer of layers) {
        if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if (object.name === "player") {
                    initialPlayerPos = k.vec2(object.x, object.y);
                    break;
                }
            }
        }
    }

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
                    let e = generateDarkSlimeComponents(k, k.vec2(object.x, object.y), initialPlayerPos);
                    entities.slimes.push(map.add(e));
                    darkEnemies.push(e);
                    continue;
                } if (object.name === "ghost") {
                    let e = generateDarkGhostComponents(k, k.vec2(object.x, object.y), initialPlayerPos);
                    entities.ghosts.push(map.add(e));
                    darkEnemies.push(e);
                    continue;
                }
            }
            continue;
        }
        darkEntities = drawDarkRoomTiles(k, map, layer, mapData.tileheight, mapData.tilewidth, initialPlayerPos, darkEntities);
    }

    let currentVis = null;

    k.camScale(4);
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
        currentVis = entities.player.visibility
        for (const e of darkEntities) {
            e[3].opacity = entities.player.pos.dist(e[1].pos)/currentVis >= 1 ? 0 : 1-entities.player.pos.dist(e[1].pos)/currentVis;
        } for (const e of darkEnemies) {
            e[5].opacity = entities.player.pos.dist(e[3].pos)/currentVis >= 1 ? 0 : 1-entities.player.pos.dist(e[3].pos)/currentVis;
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
        gameState.setPrevLoc("two");
        k.go("house");
    });
}
