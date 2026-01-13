// Global state for betting modal
let bettingModalCallback: (() => void) | null = null;

export function registerBettingModalOpener(callback: () => void) {
    bettingModalCallback = callback;
}

export function requestOpenBettingModal() {
    if (bettingModalCallback) {
        bettingModalCallback();
    } else {
        console.warn("Betting modal opener not registered");
    }
}
