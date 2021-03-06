﻿const Interval = require('./models/Interval.js');
const WorkedDay = require('./models/WorkedDay.js');
const NightHours = require('./NightHours.js');

class CalcInterval {
    constructor() {
        this.INTERVAL_MAX_LIMIT = 5 * 60000;
        this.TOTAL_MAX_LIMIT = 10 * 60000;
        this.NEGATIVE = '-';
        this.POSITIVE = '+';
    }

    totalDay(workedDay, continued = true) {
        workedDay = this.roundTens(workedDay);
        
        var totalHours = this.getSimpleTotalHours(workedDay);
        
        var nightHours = new NightHours();
        var regular = totalHours - nightHours.reducedHoursNoFactor(workedDay, continued);
        var result = regular + nightHours.reducedHours(workedDay, continued);
        return result;
    }

    getRegularHours(workedDay, continued = true) {
        var totalHours =this.getSimpleTotalHours(workedDay);
        return totalHours - new NightHours().reducedHoursNoFactor(workedDay, continued);
    }

    getSimpleTotalHours(workedDay) {
        var totalHours = workedDay.firstInterval.End - workedDay.firstInterval.Start;
        if (workedDay.secondInterval != null)
            totalHours = totalHours + (workedDay.secondInterval.End - workedDay.secondInterval.Start);
        return totalHours;
    }

    totalNightReduced(workedDay, continued = true) {
        return this.totalDay(workedDay, continued) - this.getRegularHours(workedDay, continued);
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
        if (negatives != 0 && negatives >= -Math.abs(this.TOTAL_MAX_LIMIT)) {
            workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.NEGATIVE);
            workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.NEGATIVE) : null;
        }
        
        if (positives != 0 && positives <= this.TOTAL_MAX_LIMIT) {
            workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.POSITIVE);
            workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.POSITIVE) : null;
        }

        return workedDay;
    }
    
}
module.exports = CalcInterval;