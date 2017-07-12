class Interval {
    constructor() { };
 
    get Start() { return this.start; };
    set Start(newValue) { this.start = newValue; }

    get End() { return this.end; }
    set End(value) { this.end = value; }

    get ExpectedStart() { return this.expectedStart; }
    set ExpectedStart(value) { this.expectedStart = value; }
    get ExpectedEnd() { return this.expectedEnd; }
    set ExpectedEnd(value) { this.expectedEnd = value; }

    totalStart() { return this.expectedStart - this.start; }
    totalEnd() { return this.end - this.expectedEnd; }
}
module.exports = Interval;