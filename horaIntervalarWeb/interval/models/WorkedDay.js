const Interval = require('./Interval.js');
class WorkedDay {
    constructor() {
        this.firstInterval = new Interval();
        this.secondInterval = new Interval();
    }

    get FirstInterval() { return this.firstInterval; }
    get SecondInterval() { return this.secondInterval; }

    set FirstInterval(interval) { this.firstInterval = interval; }
    set SecondInterval(interval) { this.secondInterval = interval; }
    
}
module.exports = WorkedDay;