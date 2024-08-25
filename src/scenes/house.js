import signLines from "../content/signContent.js";
import { generateOldManComponents, startInteraction } from "../entities/oldman.js";
import { generatePlayerComponents, setPlayerMovement } from "../entities/player.js";
import { generateSignComponents, startSignInteraction } from "../entities/sign.js";
import { gameState, playerState } from "../state/stateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData, playAnimIfNotPlaying } from "../utils.js";

export default async function house(k) {
    colorizeBackground(k, 27, 29, 52);

    const mapData = await fetchMapData("./assets/maps/house.json");
    const map = k.add([k.pos(0, 0)]);

    const entities = {
        oldman: null,
        player: null,
        sign1: null,
        sign2: null
    };

    const layers = mapData.layers;
    for (const layer of layers) {
        if (layer.name === "Boundaries") {
            drawBoundaries(k, map, layer);
            continue;
        } if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if (object.name === "player" && gameState.getPrevLoc() === "world") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "player-1" && gameState.getPrevLoc() === "one") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "player-2" && gameState.getPrevLoc() === "two") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "player-3" && gameState.getPrevLoc() === "three") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "player-4" && gameState.getPrevLoc() === "four") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "oldman") {
                    entities.oldman = map.add(generateOldManComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "sign-1") {
                    entities.sign1 = map.add(generateSignComponents(k, k.vec2(object.x, object.y), "sign1"));
                    continue;
                } if (object.name === "sign-2") {
                    entities.sign2 = map.add(generateSignComponents(k, k.vec2(object.x, object.y), "sign2"));
                    continue;
                } if (object.name === "sign-3") {
                    entities.sign3 = map.add(generateSignComponents(k, k.vec2(object.x, object.y), "sign3"));
                    continue;
                } if (object.name === "sign-4") {
                    entities.sign4 = map.add(generateSignComponents(k, k.vec2(object.x, object.y), "sign4"));
                    continue;
                }
            }
            continue;
        }
        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    k.camScale(4);
    playerState.setMaxHealth(3);
    playerState.setHealth(3);
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

    setPlayerMovement(k, entities.player);

    entities.player.onCollide("door-exit", () => {
        gameState.setLoc("world");
        gameState.setPrevLoc("house");
        k.go("world");
    });

    entities.player.onCollide("lv1", () => {
        gameState.setLoc("one");
        gameState.setPrevLoc("house");
        k.go("one");
    });

    entities.player.onCollide("lv2", () => {
        gameState.setLoc("two");
        gameState.setPrevLoc("house");
        k.go("two");
    });

    entities.player.onCollide("lv3", () => {
        gameState.setLoc("three");
        gameState.setPrevLoc("house");
        k.go("three");
    });

    entities.player.onCollide("lv4", () => {
        gameState.setLoc("four");
        gameState.setPrevLoc("house");
        k.go("four");
    });

    entities.player.onCollide("oldman", () => {
        startInteraction(k, entities.oldman, entities.player);
    });

    entities.player.onCollide("sign1", () => {
        startSignInteraction(k, signLines.one);
    });

    entities.player.onCollide("sign2", () => {
        startSignInteraction(k, signLines.two);
    });

    entities.player.onCollide("sign3", () => {
        startSignInteraction(k, signLines.three);
    });

    entities.player.onCollide("sign4", () => {
        startSignInteraction(k, signLines.four);
    });

    entities.player.onCollideEnd("oldman", () => {
        playAnimIfNotPlaying(entities.oldman, "oldman-down");
    });

    if (gameState.getLastHealth() !== "") {k.destroy(gameState.getLastHealth())}
    healthBar(k);
}