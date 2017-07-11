var assert = require('assert');
var HoraIntervalar = require('../horaIntervalar.js');
describe('HoraIntervalar', function () {
    describe('#CalcInterval()', function () {
        it('should return the interval difference', function () {
            //arrange
            var sut = new HoraIntervalar();
            var start = new Date(2017, 0, 24, 10, 33);
            var end =   new Date(2017, 0, 24, 11, 33);
            //act
            var result = sut.calcInterval(start, end);
            //assert
            assert.equal(60, result);
        });
    });
});