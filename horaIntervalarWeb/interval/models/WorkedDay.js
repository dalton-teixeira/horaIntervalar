const Interval = require('./Interval.js');
class WorkedDay {
    constructor() { }

    get FirstInterval() { return this.firstInterval; }
    get SecondInterval() { return this.secondInterval; }

    set FirstInterval(interval) { this.firstInterval = interval; }
    set SecondInterval(interval) { this.secondInterval = interval; }
    
}
module.exports = WorkedDay;