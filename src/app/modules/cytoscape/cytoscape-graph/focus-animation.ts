import * as colors from './clarity-colors';
import * as Cy from 'cytoscape';

// How fast refresh (frame rate)
const FRAME_RATE = 1 / 30;
// Radio of the biggest circle (i.e. when it starts)
const MAX_RADIO = 60;
const LINE_WIDTH = 1;

// Time the animation will take in ms
const ANIMATION_DURATION = 2000;

type OnFinishedCallback = () => void;

export default class FocusAnimation {
  private animationTimer;
  private startTimestamp;
  private elements;
  private onFinishedCallback?: OnFinishedCallback;

  private readonly layer;
  private readonly context;

  constructor(cy: any) {
    this.layer = cy.cyCanvas();
    this.context = this.layer.getCanvas().getContext('2d');

    cy.one('destroy', () => this.stop());
  }

  onFinished(onFinishedCallback: OnFinishedCallback): void {
    this.onFinishedCallback = onFinishedCallback;
  }

  start(elements: any): void {
    this.stop();
    this.elements = elements;
    this.animationTimer = window.setInterval(this.processStep, FRAME_RATE * 1000);
  }

  stop(): void {
    if (this.animationTimer) {
      window.clearInterval(this.animationTimer);
      this.animationTimer = undefined;
      this.clear();
    }
  }

  clear(): void {
    this.layer.clear(this.context);
  }

  // This methods needs to be an arrow function.
  // the reason is that we call this method from a window.setInterval and having an arrow function is a way to preserve
  // "this".
  processStep = () => {
    try {
      if (this.startTimestamp === undefined) {
        this.startTimestamp = Date.now();
      }
      const current = Date.now();
      const step = (current - this.startTimestamp) / ANIMATION_DURATION;
      this.layer.clear(this.context);
      this.layer.setTransform(this.context);

      if (step >= 1) {
        this.stop();
        if (this.onFinishedCallback) {
          this.onFinishedCallback();
        }
        return;
      }

      this.elements.forEach(element => this.render(element, this.easingFunction(step) * MAX_RADIO));
    } catch (exception) {
      // If a step failed, the next step is likely to fail.
      // Stop the rendering and throw the exception
      this.stop();
      throw exception;
    }
  };

  private easingFunction = (t: number): number => {
    // Do a focus animation in, out and in again.
    // Make the first focus slower and the subsequent bit faster
    if (t < 0.5) {
      // %50 of the time is spent on the first in
      return 1 - t * 2;
    } else if (t < 0.75) {
      // 25% is spent in the out animation
      return (t - 0.5) * 4;
    }
    return 1 - (t - 0.75) * 4; // 25% is spent in the second in
  };

  private getCenter = (element: any): Cy.Position => {
    if (element.isNode()) {
      return element.position();
    } else {
      return element.midpoint();
    }
  };

  private render(element: any, radio: number): void {
    const { x, y } = this.getCenter(element);
    this.context.strokeStyle = colors.Blue['300'];
    this.context.lineWidth = LINE_WIDTH;
    this.context.beginPath();
    this.context.arc(x, y, radio, 0, 2 * Math.PI, true);
    this.context.stroke();
  }
}
