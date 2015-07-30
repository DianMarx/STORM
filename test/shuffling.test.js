/**
 * Created by Shaun on 2015-07-30.
 */

var shuffling = require('./shuffling.js');

//shuffling
exports.shuffle = function(test)
{
    shuffling.shuffle(numSubj, function(val)
    {
        test.done();
    })
}