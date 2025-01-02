import { makeAutoObservable } from 'mobx';

class ProgressStore {
  progress: number = 0;
  isVisible: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setProgress(value: number) {
    this.progress = Math.min(Math.max(value, 0), 100);
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  reset() {
    this.progress = 0;
    this.isVisible = false;
  }

  start() {
    this.progress = 0;
    this.isVisible = true;
  }

  finish() {
    this.progress = 100;
    setTimeout(() => {
      this.reset();
    }, 300); // Match the transition duration
  }
}

export const progressStore = new ProgressStore(); 