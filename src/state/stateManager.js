import globalStateManager from "./globalState.js";
import playerGlobalStateManager from "./playerGlobalState.js";

export const gameState = globalStateManager().getInstance();
export const playerState = playerGlobalStateManager().getInstance();
