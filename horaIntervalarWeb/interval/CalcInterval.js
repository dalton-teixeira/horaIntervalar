const Interval = require('./models/Interval.js');
const WorkedDay = require('./models/WorkedDay.js');

class CalcInterval {
    constructor() {
        this.INTERVAL_MAX_LIMIT = 5 * 60000;
        this.TOTAL_MAX_LIMIT = 10 * 60000;
        this.NEGATIVE = '-';
        this.POSITIVE = '+';
    }

    totalDay(workedDay) {
        workedDay = this.roundTens(workedDay);
        var result = workedDay.firstInterval.End - workedDay.firstInterval.Start;
        if (workedDay.secondInterval == null) return result;
        return result + (workedDay.secondInterval.End - workedDay.secondInterval.Start);
    }

    formatTotalHours(number) {
        var totalHours = this.createDate(number);
        var _h = totalHours.getUTCHours().toString();
        var _m = totalHours.getUTCMinutes().toString();
        if (_h.length == 1) _h = "0" + _h;
        if (_m.length == 1) _m = "0" + _m;
        return _h + ":" + _m;
    }

    totalNegatives(interval) {
        var result = interval.totalStart() < 0 ? interval.totalStart() : 0;
        result = interval.totalEnd() < 0 ? result + interval.totalEnd() : result;
        return result;
    }

    totalPositives(interval) {
        var result = interval.totalStart() > 0 ? interval.totalStart() : 0;
        result = interval.totalEnd() > 0 ? result + interval.totalEnd() : result;
        return result;
    }

    roundInterval(interval, operation) {
        
        interval.Start = this.roundFives(interval.Start, interval.ExpectedStart - interval.Start, interval.ExpectedStart, operation);
        interval.End = this.roundFives(interval.End, interval.End - interval.ExpectedEnd, interval.ExpectedEnd, operation);
        
        return interval;
    }

    roundFives(actual, diff, expected, operation) {
      
        if (operation == this.NEGATIVE
            && diff < 0
            && diff >= -Math.abs(this.INTERVAL_MAX_LIMIT)) {
            return expected;
        }

        if (operation == this.POSITIVE
            && diff > 0
            && diff <= this.INTERVAL_MAX_LIMIT) {
            return expected;
        }
        
        return actual;
    }
    
    roundTens(workedDay) {
        var isMultipleInterval = workedDay.secondInterval != null;
        var negatives = this.totalNegatives(workedDay.firstInterval);
        var positives = this.totalPositives(workedDay.firstInterval);
        
        if (isMultipleInterval) {
            negatives = negatives + this.totalNegatives(workedDay.secondInterval);
            positives = positives + this.totalPositives(workedDay.secondInterval);
        }

        if (negatives >= -Math.abs(this.TOTAL_MAX_LIMIT)) {
            workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.NEGATIVE);
            workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.NEGATIVE) : null;
        }

        if (positives <= this.TOTAL_MAX_LIMIT) {
            workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.POSITIVE);
            workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.POSITIVE) : null;
        }

        return workedDay;
    }

    createDate(number) {
        var result = new Date(number);
        var seconds = result.getSeconds();

        if (seconds > 30) {
            result.setMinutes(result.getMinutes() + 1);
            result.setSeconds(0);
            return result;
        } else if (seconds > 0 && seconds < 30) {
            result.setMinutes(result.getMinutes() - 1);
            result.setSeconds(0);
            return result;
        }
        return result;
    }

}
module.exports = CalcInterval;