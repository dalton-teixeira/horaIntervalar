class NightHours {
    
    totalNightHours(workedDay) {
        
        var result = this.getNightHours(workedDay.firstInterval, workedDay.date)
            + this.getNightHours(workedDay.secondInterval, workedDay.date);
        return result;
    }

    getNightHoursBegin(date) {
        var result = new Date(date.getTime());
        result.setHours(date.getHours()+22);
        result.setMinutes(0);
        result.setSeconds(0);
        result.setMilliseconds(0);
        return result;
    }

    getNightHours(interval, date) {
        if (interval === undefined || interval === null) return 0;
        
        var nightBegin = this.getNightHoursBegin(date);
        
        if (interval.start >= nightBegin) return interval.end - interval.start;        
        if (interval.end > nightBegin) return interval.end - nightBegin;
        return 0;   
    }

    reducedHours(workedDay, continued) {        
        const factor = 1.14285;
        var result = this.reducedHoursNoFactor(workedDay, continued);
        return result > 0 ? result * factor : 0;
    }

    reducedHoursNoFactor(workedDay, continued) {
        return continued
            ? this.totalNightHours(workedDay)
            : this.getReduced(workedDay.firstInterval, workedDay.date)
            + this.getReduced(workedDay.secondInterval, workedDay.date);
    }

    getReduced(interval, date) {
        var result = 0;
        
        if (interval === undefined || interval === null) return 0;


        const end = this.getNightHoursEnd(date);
        const begin = this.getNightHoursBegin(date);
        if (interval.start >= begin)
            result = interval.end - interval.start;
        
        if (interval.end > begin)
            result = interval.end - begin;

        if (result > 0 && interval.end > end)
            result = result - (interval.end - end);

        return result;          
    }

    getNightHoursEnd(date) {
        var result = new Date(date.getTime());
        result.setDate(result.getDate() + 1);
        result.setHours(5);
        result.setMinutes(0);
        result.setSeconds(0);
        result.setMilliseconds(0);
        return result;
    }
}
module.exports = NightHours;