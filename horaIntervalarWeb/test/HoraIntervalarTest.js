var assert = require('assert');
const CalcInterval = require('../interval/CalcInterval.js');
var Interval = require('../interval/models/Interval.js');
var WorkedDay = require('../interval/models/WorkedDay.js');

describe('CalcInterval', function () {
    describe('#roundFives()', function () {
        it('should return the actual interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 10, 10);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, expected);
            //assert
            assert.equal(actual, result);
        });

        it('should return the rounded interval for more 5.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 11, 05);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, expected);
            //assert
            assert.equal(0, result - expected);
        });

        it('should return the rounded interval for minus 5.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 10, 55);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, expected);
            //assert
            assert.equal(0, result - expected);
        });
    });

    describe('#roundInterval(interval))', function () {
        it('should round the entire interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var interval = new Interval();
            interval.Start = new Date(2017, 0, 24, 07, 55);
            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.End = new Date(2017, 0, 24, 12, 05);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);
            console.log(interval);
            //act
            result = sut.roundInterval(interval);

            //assert
            assert.equal(0, result.start - interval.expectedStart);
            assert.equal(0, result.end - interval.expectedEnd);

        });
    });
});