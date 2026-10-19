export class TimerEngine {
  constructor(options = {}) {
    this.prepDuration = options.prepDuration || 0;
    this.actionDuration = options.actionDuration || 0;
    this.onTick = options.onTick || null;
    this.onPhaseChange = options.onPhaseChange || null;
    this.onWarning = options.onWarning || null;
    this.onFinish = options.onFinish || null;

    this.currentPhase = "idle"; // 'idle' | 'prep' | 'action' | 'finished'
    this.remainingSeconds = 0;
    this.intervalId = null;
    this.isPaused = false;
  }

  start(prepSeconds, actionSeconds) {
    this.stop();
    this.prepDuration = prepSeconds;
    this.actionDuration = actionSeconds;

    if (this.prepDuration > 0) {
      this.currentPhase = "prep";
      this.remainingSeconds = this.prepDuration;
    } else {
      this.currentPhase = "action";
      this.remainingSeconds = this.actionDuration;
    }

    if (this.onPhaseChange) {
      this.onPhaseChange(this.currentPhase, this.remainingSeconds);
    }
    if (this.onTick) {
      this.onTick(this.remainingSeconds, this.formatTime(this.remainingSeconds), this.currentPhase);
    }

    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.isPaused) return;

    this.remainingSeconds--;

    if (this.remainingSeconds <= 10 && this.remainingSeconds > 0 && this.onWarning) {
      this.onWarning(this.remainingSeconds, this.currentPhase);
    }

    if (this.onTick) {
      this.onTick(this.remainingSeconds, this.formatTime(this.remainingSeconds), this.currentPhase);
    }

    if (this.remainingSeconds <= 0) {
      if (this.currentPhase === "prep" && this.actionDuration > 0) {
        // Transition from Prep Phase to Action Phase
        this.currentPhase = "action";
        this.remainingSeconds = this.actionDuration;
        if (this.onPhaseChange) {
          this.onPhaseChange(this.currentPhase, this.remainingSeconds);
        }
        if (this.onTick) {
          this.onTick(this.remainingSeconds, this.formatTime(this.remainingSeconds), this.currentPhase);
        }
      } else {
        // Finished completely
        this.stop();
        this.currentPhase = "finished";
        if (this.onFinish) {
          this.onFinish();
        }
      }
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPaused = false;
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
}
