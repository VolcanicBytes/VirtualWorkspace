export class Watchdog {
    private timeout?: NodeJS.Timeout;
    private delay: number;
    private Callback: () => void;

    constructor(callback: () => void, ms: number) {
        this.Callback = callback;
        this.delay = ms;
    }

    public Reset() {
        this.Clear();
        this.Set();
    }

    private Set() {
        this.timeout = setTimeout(this.Callback, this.delay);
    }

    public Clear() {
        if (this.timeout)
            clearTimeout(this.timeout);
    }

}