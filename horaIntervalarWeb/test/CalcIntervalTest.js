var assert = require('assert');
const CalcInterval = require('../interval/CalcInterval.js');
const Controller = require('../interval/Controller.js');
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
            var result = sut.roundFives(actual, actual - expected, expected, '-');
            //assert
            assert.equal(actual, result);
        });

        it('should return the actual interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 10, 10);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, actual - expected, expected, '+');
            //assert
            assert.equal(actual, result);
        });

        it('should return the rounded interval for more 5.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 11, 05);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, actual - expected, expected);
            //assert
            assert.equal(0, result - actual, '-');
        });

        it('should return the rounded interval for more 5.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 11, 05);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, actual - expected, expected);
            //assert
            assert.equal(0, result - actual, '+');
        });

        it('should return the rounded interval for minus 5.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 10, 55);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, actual - expected, expected, '-');
            //assert
            assert.equal(0, result - expected);
        });

        it('should return the rounded interval for minus 5.', function () {
            //arrange
            var sut = new CalcInterval();
            var actual = new Date(2017, 0, 24, 10, 55);
            var expected = new Date(2017, 0, 24, 11, 00);
            //act
            var result = sut.roundFives(actual, actual - expected, expected, '+');
            //assert
            assert.equal(0, result - actual);
        });
    });
    
    describe('#roundInterval(interval)', function () {
        it('should round the entire interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var interval = new Interval();
            interval.Start = new Date(2017, 0, 24, 07, 55);
            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.End = new Date(2017, 0, 24, 12, 05);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            //act
            var result = sut.roundInterval(interval, '+');
            
            //assert
            assert.equal(0, result.start - interval.expectedStart);
            assert.equal(0, result.end - interval.expectedEnd);

        });
    });
    
    describe('#totalPositives(interval)', function () {
        it('should calc the total on starting and ending.', function () {
            //arrange
            var interval = new Interval();
            interval.Start =         new Date(2017, 0, 24, 07, 55);
            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.End =         new Date(2017, 0, 24, 12, 05);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);
            var sut = new CalcInterval();
            //act
            var result = sut.totalPositives(interval);
            
            //assert
            assert.equal(10 * 60000, result);
        });

        it('should calc the total on starting and ending.', function () {
            //arrange
            var interval = new Interval();
            interval.Start = new Date(2017, 0, 24, 08, 05);
            interval.End = new Date(2017, 0, 24, 11, 55);

            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            //act
            start = interval.totalStart(interval);
            end = interval.totalEnd(interval);

            //assert
            assert.equal(-(5 * 60000), start);
            assert.equal(-(5 * 60000), end);
        });

        it('should calc the total on starting and ending.', function () {
            //arrange
            var interval = new Interval();
            interval.Start = new Date(2017, 0, 24, 07, 55);
            interval.End = new Date(2017, 0, 24, 11, 55);

            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            //act
            start = interval.totalStart(interval);
            end = interval.totalEnd(interval);

            //assert
            assert.equal(5 * 60000, start);
            assert.equal(-(5 * 60000), end);
        });
    });
        
    describe('#totalNegatives(interval)', function () {
        it('should sum the entire interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var interval = new Interval();
            interval.Start = new Date(2017, 0, 24, 07, 55);
            interval.End = new Date(2017, 0, 24, 12, 05);

            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            //act
            var negatives = sut.totalNegatives(interval);
            var positives = sut.totalPositives(interval);
            
            //assert
            assert.equal(10 * 60000, positives);
            assert.equal(0, negatives);
        });
        
        it('should sum the entire interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var interval = new Interval();
            interval.Start = new Date(2017, 0, 24, 07, 55);
            interval.End = new Date(2017, 0, 24, 11, 55);

            interval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            interval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            //act
            var positives = sut.totalPositives(interval);
            var negatives = sut.totalNegatives(interval);
            
            //assert
            assert.equal(5 * 60000, positives);
            assert.equal(-(5 * 60000), negatives);
        });
    });

    describe('#roundTens(workedDay)', function () {
        it('Should round based on tens rules.', function () {
            //arrange
            var sut = new CalcInterval();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 07, 55);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 11, 58);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 24, 13, 02);
            secondInterval.ExpectedStart = new Date(2017, 0, 24, 13, 00);
            secondInterval.End = new Date(2017, 0, 24, 17, 59);
            secondInterval.ExpectedEnd = new Date(2017, 0, 24, 18, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;
            workedDay.date = new Date(2017, 0, 24, 0, 0);

            //act
            var result = sut.roundTens(workedDay);
            //assert
            assert.equal(0, result.firstInterval.Start - result.firstInterval.expectedStart);
            assert.equal(0, result.firstInterval.End - result.firstInterval.expectedEnd);
            assert.equal(0, result.secondInterval.End - result.secondInterval.expectedEnd);
            assert.equal(0, result.secondInterval.Start - result.secondInterval.expectedStart);
        });

        it('Should round based on tens rules.', function () {
            //arrange
            var sut = new CalcInterval();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 07, 54);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 12, 01);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 24, 13, 02);
            secondInterval.ExpectedStart = new Date(2017, 0, 24, 13, 00);
            secondInterval.End = new Date(2017, 0, 24, 17, 59);
            secondInterval.ExpectedEnd = new Date(2017, 0, 24, 18, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;
            workedDay.date = new Date(2017, 0, 24, 0, 0);

            //act
            var result = sut.roundTens(workedDay);
            //assert
            assert.equal(0, result.firstInterval.Start - firstInterval.Start);
            assert.equal(0, result.firstInterval.End - result.firstInterval.expectedEnd);
            assert.equal(0, result.secondInterval.End - result.secondInterval.expectedEnd);
            assert.equal(0, result.secondInterval.Start - result.secondInterval.expectedStart);
        });


        it('Should round based on tens rules.', function () {
            //arrange
            var sut = new CalcInterval();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 07, 54);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 12, 05);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 24, 13, 02);
            secondInterval.ExpectedStart = new Date(2017, 0, 24, 13, 00);
            secondInterval.End = new Date(2017, 0, 24, 17, 59);
            secondInterval.ExpectedEnd = new Date(2017, 0, 24, 18, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;

            workedDay.date = new Date(2017, 0, 24, 0, 0);
            //act
            var result = sut.roundTens(workedDay);
            //assert
            assert.equal(0, result.firstInterval.Start - firstInterval.Start);
            assert.equal(0, result.firstInterval.End - firstInterval.End);
            assert.equal(0, result.secondInterval.End - result.secondInterval.expectedEnd);
            assert.equal(0, result.secondInterval.Start - result.secondInterval.expectedStart);
        });
    });

    describe('#totalDay(workedDay)', function () {
        it('Should get total day multiple interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 07, 55);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 11, 58);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 24, 13, 02);
            secondInterval.ExpectedStart = new Date(2017, 0, 24, 13, 00);
            secondInterval.End = new Date(2017, 0, 24, 17, 59);
            secondInterval.ExpectedEnd = new Date(2017, 0, 24, 18, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;
            workedDay.date = new Date(2017, 0, 24, 0, 0);
            //act
            var result = sut.totalDay(workedDay);
            //assert
            assert.equal(9.0, new Controller().formatTotalHours(result));
        });

        it('Should get total day single interval.', function () {
            //arrange
            var sut = new CalcInterval();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 07, 55);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 11, 58);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 0, 0);

            //act
            var result = sut.totalDay(workedDay);
            //assert
            assert.equal("4.0", new Controller().formatTotalHours(result));
        });
    });
    
});