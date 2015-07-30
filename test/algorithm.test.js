/**
 * Created by Shaun on 2015-07-28.
 */

var algorithm = require('./algorithm.js');

//algorithm
exports.randomize = function(test)
{
    algorithm.randomize(numSubj, function(val)
    {
        test.done();
    })
}