import { generatePlayerComponents, setPlayerMovement } from "../entities/player.js";
import { generateSlimeComponents, setSlimeAI } from "../entities/slime.js";
import { gameState, playerState } from "../state/stateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData, onAttacked, onCollideWithPlayer } from "../utils.js";

export default async function world(k) {
    colorizeBackground(k, 76, 170, 255);
    const mapData = await fetchMapData("./assets/maps/world.json");

    const map = k.add([k.pos(0, 0)]);

    const entities = {
        player: null
    };

    const layers = mapData.layers;
    for (const layer of layers) {
        if (layer.name === "Boundaries") {
            drawBoundaries(k, map, layer);
            continue;
        } if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if (object.name === "player" && gameState.getPrevLoc() === "") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                } if (object.name === "player-house" && gameState.getPrevLoc() === "house") {
                    entities.player = map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)));
                    continue;
                }
            }
            continue;
        }
        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

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
    });

    setPlayerMovement(k, entities.player);
    playerState.setIsSwordEquipped(true);

    entities.player.onCollide("door-entrance", () => {
        gameState.setPrevLoc("world");
        gameState.setLoc("house");
        k.go("house");
    });
}
