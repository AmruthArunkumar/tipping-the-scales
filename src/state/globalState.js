export default function globalStateManager() {
    let instance = null;

    function createInstance() {
        let freezePlayer = false;
        let fontSize = 32;
        let loc = "world";
        let prevLoc = "";
        let lastStat = "";
        let lastHealth = "";

        return {
            setFreezePlayer(value) { freezePlayer = value; },
            getFreezePlayer: () => freezePlayer,
            setFontSize(value) { fontSize = value; },
            getFontSize: () => fontSize,
            setLoc(value) { loc = value; },
            getLoc: () => loc,
            setPrevLoc(value) { prevLoc = value; },
            getPrevLoc: () => prevLoc,
            setLastStat(value) { lastStat = value; },
            getLastStat: () => lastStat,
            setLastHealth(value) { lastHealth = value; },
            getLastHealth: () => lastHealth
        }
    }

    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}
