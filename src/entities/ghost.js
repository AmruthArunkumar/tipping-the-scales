export function generateGhostComponents(k, pos) {
    return [
        k.sprite("assets", {anim: "ghost-down"}),
        k.area({shape: new k.Rect(k.vec2(2, 4), 12, 12)}),
        k.body(),
        k.pos(pos),
        k.offscreen(),
        k.health(5),
        k.opacity(),
        k.state("idle", ["idle", "right", "backtrack", "attack", "evade"]),
        {
            isAttacking: false,
            attackPower: 0.5,
            prevPos: k.vec2(0, 0)
        },
        "ghost"
    ];
}

export function generateDarkGhostComponents(k, pos, playerPos) {
    return [
        k.sprite("assets", {
            anim: "ghost-down"
        }),
        k.area({shape: new k.Rect(k.vec2(2, 4), 12, 12)}),
        k.body(),
        k.pos(pos),
        k.offscreen(),
        k.opacity(playerPos.dist(pos)/50 >= 1 ? 0 : 1-playerPos.dist(pos)/50),
        k.state("idle", ["idle", "right", "backtrack", "attack", "evade"]),
        k.health(5),
        {
            isAttacking: false,
            attackPower: 0.5,
            prevPos: k.vec2(0, 0)
        },
        "ghost"
    ];
}

export function setGhostAI(k, ghost, player) {
    const updateRef = k.onUpdate(() => {
        ghost.isAttacking = false;
        if (player.pos.dist(ghost.pos) < player.visibility) {
            ghost.enterState("attack");
            updateRef.cancel();
        }
    });

    k.loop(5, () => {
        ghost.prevPos = ghost.pos;
    });

    const idle = ghost.onStateEnter("idle", async () => {
        const updateRef = k.onUpdate(() => {
            ghost.isAttacking = false;
            if (player.pos.dist(ghost.pos) < player.visibility) {
                ghost.enterState("attack");
                updateRef.cancel();
            }
        });
    });

    const backtrack = ghost.onStateEnter("backtrack", async () => {
        ghost.isAttacking = false;
        await k.tween(
            ghost.pos.x,
            ghost.pos.x + 50,
            1,
            (val) => (ghost.pos.x = val),
            k.easings.linear
        );
        if (player.pos.dist(ghost.pos) > player.visibility) {
            ghost.enterState("idle");
            return;
        }
        ghost.enterState("right");
    });

    const right = ghost.onStateEnter("right", async () => {
        ghost.isAttacking = false;
        await k.tween(
            ghost.pos.x,
            ghost.pos.x + 50,
            1,
            (val) => (ghost.pos.x = val),
            k.easings.linear
        );
        if (player.pos.dist(ghost.pos) > player.visibility) {
            ghost.enterState("idle");
            return;
        }
        ghost.enterState("attack");
    });

    const attack = ghost.onStateEnter("attack", async () => {
        ghost.isAttacking = true;
        const attackSpeeds = [0.5, 0.8, 1];

        await k.tween(
            ghost.pos,
            player.pos,
            attackSpeeds[Math.floor(Math.random() * attackSpeeds.length)],
            (val) => (ghost.pos = val),
            k.easings.linear
        );

        if (player.pos.dist(ghost.pos) > player.visibility) {
            ghost.enterState("idle");
            return;
        } if (ghost.getCollisions().length > 0) {
            ghost.enterState("evade");
            return;
        }
        ghost.enterState("attack");
    });

    const evade = ghost.onStateEnter("evade", async () => {
        ghost.isAttacking = false;
        await k.tween(
            ghost.pos,
            ghost.prevPos,
            0.8,
            (val) => (ghost.pos = val),
            k.easings.linear
        );
        if (player.pos.dist(ghost.pos) > player.visibility) {
            ghost.enterState("idle");
            return;
        }
        ghost.enterState("attack");
    });

    k.onSceneLeave(() => {
        backtrack.cancel();
        right.cancel();
        attack.cancel();
        evade.cancel();
        idle.cancel();
        updateRef.cancel();
    });
}


