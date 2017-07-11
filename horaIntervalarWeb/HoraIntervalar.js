class HoraIntervalar {
    /**
     * /
     * @param {Date} start
     * @param {Date} end
     * @returns {int} minutes
     */
    calcInterval(start, end) {
        var diff = end - start;
        //remove seconds and milleseconds repectively
        var result = (diff / 60) / 1000
        return result;
    }
}
module.exports = HoraIntervalar;