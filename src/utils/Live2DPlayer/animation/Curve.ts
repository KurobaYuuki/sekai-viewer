export type CurveFunction = (t: number) => number;
interface ICurveFunctionMap {
  (p: CurveFunction): CurveFunction;
}

export class Curve {
  p: CurveFunction;
  constructor(curve_func: CurveFunction = (t) => t) {
    this.p = curve_func;
  }
  bounce(start = 0.5, end = 0.5) {
    const f: ICurveFunctionMap = (p) => (t: number) =>
      t < start ? p(t / start) : t < 1 - end ? 1 : p((1 - t) / end);
    return new Curve(f(this.p));
  }
  wiggle(freq: number, start = 0.5, end = 0.5) {
    let random_list = Array.from({ length: freq }, () => Math.random());
    random_list = [start, ...random_list, end];
    return new Curve((t: number) => {
      if (t === 1) return 0;
      const x = t * (freq + 1);
      const xi = Math.floor(x);
      const xf = x - xi;
      const g0 = random_list[xi];
      const g1 = random_list[xi + 1];
      return g0 + xf * xf * (3 - 2 * xf) * (g1 - g0);
    });
  }
  /**
   * @see https://easings.net/#easeInOutSine
   */
  ease() {
    const f: ICurveFunctionMap = (p) => (t: number) =>
      p(-(Math.cos(Math.PI * t) - 1) / 2);
    return new Curve(f(this.p));
  }
  /**
   * @s
    );ee https://easings.net/#easeOutExpo
   */
  easeOutExpo() {
    const f: ICurveFunctionMap = (p) => (t: number) =>
      p(t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    return new Curve(f(this.p));
  }
  /**
   * @s
    );ee https://easings.net/#easeOutQuad
   */
  easeOutQuad() {
    const f: ICurveFunctionMap = (p) => (t: number) => p(1 - (1 - t) * (1 - t));
    return new Curve(f(this.p));
  }
  /**
   * @see https://easings.net/#easeInExpo
   */
  easeInExpo() {
    const f: ICurveFunctionMap = (p) => (t: number) =>
      p(t === 0 ? 0 : Math.pow(2, 10 * t - 10));
    return new Curve(f(this.p));
  }
  loop(period: number) {
    const f: ICurveFunctionMap = (p) => (t: number) => p((t * period) % 1);
    return new Curve(f(this.p));
  }
  offset(offset: number) {
    const f: ICurveFunctionMap = (p) => (t: number) => p((t + 1 - offset) % 1);
    return new Curve(f(this.p));
  }
  shrink(length: number, to = 0) {
    const f: ICurveFunctionMap = (p) => (t: number) =>
      t < length ? p(t / length) : to;
    return new Curve(f(this.p));
  }
  reverse() {
    const f: ICurveFunctionMap = (p) => (t: number) => p(1 - t);
    return new Curve(f(this.p));
  }
  map_range(to_min: number, to_max: number, from_min = 0, from_max = 1) {
    const f: ICurveFunctionMap = (p) => (t: number) =>
      ((p(t) - from_min) / (from_max - from_min)) * (to_max - to_min) + to_min;
    return new Curve(f(this.p));
  }
  multiply(curve: Curve) {
    const f: ICurveFunctionMap = (p) => (t: number) => p(t) * curve.p(t);
    return new Curve(f(this.p));
  }
}
