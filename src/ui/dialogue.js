import { gameState } from "../state/stateManager.js";

async function displayLine(textContainer, line) {
    for (const char of line) {
        await new Promise((resolve) => {
            setTimeout(() => {
                textContainer.text += char;
                resolve();
            }, 10);
        });
    }
}

export async function displayStats(textContainer, line) {
    for (const char of line) {
        textContainer.text += char;
    }
}

export async function dialogue(k, pos, content) {
    gameState.setFreezePlayer(true);

    const dialogueBox = k.add([k.rect(800, 200), k.pos(pos), k.fixed()]);
    const textContainer = dialogueBox.add([
        k.text("", {
            font: "silkscreen",
            width: 700,
            lineSpacing: 15,
            size: gameState.getFontSize()
        }),
        k.color(27, 29, 52),
        k.pos(25, 30),
        k.fixed()
    ]);

    let index = 0;

    await displayLine(textContainer, content[index]);
    let lineFinishedDisplay = true;
    const dialogueKey = k.onKeyDown("enter", async () => {
        if (!lineFinishedDisplay) return;
        index++;
        if (!content[index]) {
            k.destroy(dialogueBox);
            dialogueKey.cancel();
            gameState.setFreezePlayer(false);
            return;
        }

        textContainer.text = "";
        lineFinishedDisplay = false;
        await displayLine(textContainer, content[index]);
        lineFinishedDisplay = true;
    })
}
