const CalcInterval = require('./CalcInterval.js');
const Factory = require('./Factory.js');
const NightHours = require('./NightHours.js');
class Controller {
        
    calcule(date
        , startHours
        , endHours
        , expectedStart
        , expectedEnd
        , startHours2
        , endHours2
        , expectedStart2
        , expectedEnd2
        , continued = true) {

        var factory = new Factory();
        var calcInterval = new CalcInterval();
        
        var workedDay = factory.createWorkedDay(
                date
                , startHours
                , endHours
                , expectedStart
                , expectedEnd
                , startHours2
                , endHours2
                , expectedStart2
                , expectedEnd2);
        
        var result = calcInterval.totalDay(workedDay, continued);
        return this.formatTotalHours(result);
    }

    totalNightHours(date
        , startHours
        , endHours
        , expectedStart
        , expectedEnd
        , startHours2
        , endHours2
        , expectedStart2
        , expectedEnd2
        , continued = true) {
        
        var workedDay = new Factory().createWorkedDay(
            date
            , startHours
            , endHours
            , expectedStart
            , expectedEnd
            , startHours2
            , endHours2
            , expectedStart2
            , expectedEnd2);
        var result = new CalcInterval().totalNightReduced(workedDay, continued);

        return this.formatTotalHours(result);
    }
    formatTotalHours(number) {
        var totalHours = this.createRoundedDate(number);
        var _h = parseInt(totalHours.getUTCHours());
        var _m = totalHours.getUTCMinutes().toString();
        
        if (_m.length < 2) _m = _m.length == 1 ? "0" + _m : "00";
        return _h + ":" + _m;
    }

    createRoundedDate(number) {
        var result = new Date(number);
        var seconds = result.getSeconds();

        if (seconds >= 30) {
            result.setMinutes(result.getMinutes() + 1);
            result.setSeconds(0);
        }
        return result;
    }

}
module.exports = Controller;