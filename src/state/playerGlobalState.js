export default function playerGlobalStateManager() {
    let instance = null;

    function createInstance() {
        let isSwordEquipped = false;
        let maxHealth = 3;
        let health = maxHealth;
        let scale = 2;
        
        return {
            setIsSwordEquipped(value) {isSwordEquipped = value;},
            getIsSwordEquipped: () => isSwordEquipped,
            setMaxHealth(value) {health = (value > maxHealth) ? health + 1 : ((value === maxHealth) ? Math.min(health, value) : Math.min(health-1, value)); maxHealth = value;},
            getMaxHealth: () => maxHealth,
            setHealth(value) {health = value;},
            getHealth: () => health,
            setScale(value) {scale = value;},
            getScale: () => scale
        };
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