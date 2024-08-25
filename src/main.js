import k from "./kaplayContext.js"
import world from "./scenes/world.js";
import house from "./scenes/house.js";
import one from "./scenes/one.js";
import two from "./scenes/two.js";
import three from "./scenes/three.js";
import four from "./scenes/four.js";


k.loadFont("silkscreen", "./assets/slkscr.ttf");
k.loadSprite("assets", "./assets/topdownasset.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "player-idle-down": 936,
        "player-down": {from: 936, to: 939, loop: true},
        "player-idle-side": 975,
        "player-side": {from: 975, to: 978, loop: true},
        "player-idle-up": 1014,
        "player-up": {from: 1014, to: 1017, loop: true},

        "player-attack-up": 1094,
        "player-attack-down": 1092,
        "player-attack-left": 1093,
        "player-attack-right": 1093,

        "slime-idle-down": 858,
        "slime-down": {from: 858, to: 859, loop: true},
        "slime-idle-side": 860,
        "slime-side": {from: 860, to: 861, loop: true},
        "slime-idle-up": 897,
        "slime-up": {from: 897, to: 898, loop: true},

        "oldman-down": 866,
        "oldman-side": 907,
        "oldman-up": 905,

        "ghost-down": {from: 862, to: 863, loop: true},

        "sign": 22,
        "dark-tile": 391
    }
});

k.loadSpriteAtlas("./assets/topdownasset.png", {
    "full-heart": {x: 0, y: 224, width: 48, height: 48},
    "half-heart": {x: 48, y: 224, width: 48, height: 48},
    "empty-heart": {x: 96, y: 224, width: 48, height: 48},
    "scale-one": {x: 256, y: 48, width: 48, height: 16},
    "scale-two": {x: 256, y: 64, width: 48, height: 16},
    "scale-three": {x: 256, y: 80, width: 48, height: 16}
});

const scenes = {
    world,
    house,
    one,
    two,
    three,
    four
};

for (const sceneName in scenes) {
    k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("world");
