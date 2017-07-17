var assert = require('assert');
const Factory = require('../interval/Factory.js');

describe('Factory', function () {
    describe('#createInterval()', function () {
        it('should return new interval.', function () {
            //arrange
            var sut = new Factory();
            var date = 42742;
            var startHours = 0.371527777777;
            var endHours = 0.5034722222;
            var expectedDate = 42742;
            var expectedStart = "09:00";
            var expectedEnd = "12:00";
            var _start = "Sat, 07 Jan 2017 08:55:00 GMT";
            var _end = "Sat, 07 Jan 2017 12:05:00 GMT";
            var _Xstart = "Sat, 07 Jan 2017 09:00:00 GMT";
            var _Xend = "Sat, 07 Jan 2017 12:00:00 GMT";
            //act
            var result = sut.createInterval(date, startHours, endHours, expectedDate, expectedStart, expectedEnd);
            
            //assert
            assert.equal(_start, result.start.toGMTString());
            assert.equal(_end, result.end.toGMTString());
            assert.equal(_Xstart, result.expectedStart.toGMTString());
            assert.equal(_Xend, result.expectedEnd.toGMTString());
        });

    });

    describe('#createWorkedDay()', function () {
        it('should return new WorkedDay.', function () {
            //arrange
            var sut = new Factory();
            var date = 42742;
            var startHours = 0.371527777777;
            var endHours = 0.5034722222;
            var expectedDate = 42742;
            var expectedStart = "09:00";
            var expectedEnd = "12:00";
            var _start = "Sat, 07 Jan 2017 08:55:00 GMT";
            var _end = "Sat, 07 Jan 2017 12:05:00 GMT";
            var _Xstart = "Sat, 07 Jan 2017 09:00:00 GMT";
            var _Xend = "Sat, 07 Jan 2017 12:00:00 GMT";
            //act
            var result = sut.createWorkedDay(date, startHours, endHours, expectedStart, expectedEnd, null, null, null, null);

            //assert
            assert.equal(_start, result.firstInterval.start.toGMTString());
            assert.equal(_end, result.firstInterval.end.toGMTString());
            assert.equal(_Xstart, result.firstInterval.expectedStart.toGMTString());
            assert.equal(_Xend, result.firstInterval.expectedEnd.toGMTString());
        });
        
        it('should return new WorkedDay.', function () {
            //arrange
            var sut = new Factory();
            var date = 42742;
            var startHours = 0.371527777777;
            var endHours = 0.5034722222;
            var expectedDate = 42742;
            var expectedStart = "09:00";
            var expectedEnd = "12:00";
            var startHours2 = 0.54513888888;
            var endHours2 = 0.711805555555;
            var expectedStart2 = "13:00";
            var expectedEnd2 = "17:00";
            var _start = "Sat, 07 Jan 2017 08:55:00 GMT";
            var _end = "Sat, 07 Jan 2017 12:05:00 GMT";
            var _Xstart = "Sat, 07 Jan 2017 09:00:00 GMT";
            var _Xend = "Sat, 07 Jan 2017 12:00:00 GMT";
            var _start2 = "Sat, 07 Jan 2017 13:05:00 GMT";
            var _end2 = "Sat, 07 Jan 2017 17:05:00 GMT";
            var _Xstart2 = "Sat, 07 Jan 2017 13:00:00 GMT";
            var _Xend2 = "Sat, 07 Jan 2017 17:00:00 GMT";
            //act
            var result = sut.createWorkedDay(
                date
                , startHours
                , endHours
                , expectedStart
                , expectedEnd
                , startHours2
                , endHours2
                , expectedStart2
                , expectedEnd2);

            //assert
            assert.equal(_start, result.firstInterval.start.toGMTString());
            assert.equal(_end, result.firstInterval.end.toGMTString());
            assert.equal(_Xstart, result.firstInterval.expectedStart.toGMTString());
            assert.equal(_Xend, result.firstInterval.expectedEnd.toGMTString());
            assert.equal(_start2, result.secondInterval.start.toGMTString());
            assert.equal(_end2, result.secondInterval.end.toGMTString());
            assert.equal(_Xstart2, result.secondInterval.expectedStart.toGMTString());
            assert.equal(_Xend2, result.secondInterval.expectedEnd.toGMTString());
        });
    });
    
});