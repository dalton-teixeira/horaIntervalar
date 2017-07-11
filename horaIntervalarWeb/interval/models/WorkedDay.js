const Interval = require('./Interval.js');
class WorkedDay {
    constructor() {
        this.firstInterval = new Interval();
        this.secondInterval = new Interval();
    }

    get firstInterval() { return this.firstInterval; }
    get secondInterval() { return this.secondInterval; }

    set firstInterval(interval) { this.firstInterval = interval; }
    set secondInterval(interval) { this.secondInterval = interval; }
    
}
module.exports = WorkedDay;