/**
 * Created by Shaun on 2015-07-28.
 */

var algorithm = require('./algorithm.js');
var projectSetup = require('./projectSetup.js');
var shuffling = require('./shuffling.js');
var teamSetup = require('./teamSetupJS.js');

//algorithm
exports.randomize = function(test)
{
    algorithm.randomize(numSubj, function(val)
    {
        test.done();
    })
}

//projectSetup


//shuffling
exports.shuffle = function(test)
{
    shuffling.shuffle(numSubj, function(val)
    {
        test.done();
    })
}

//teamSetup
exports.fnOpenNormalDialog = function(test)
{
    teamSetup.fnOpenNormalDialog(function(val)
    {
        test.done();
    })
}

exports.confirmDeleteTeamTable = function(test)
{
    teamSetup.confirmDeleteTeamTable(function(val)
    {
        test.done();
    })
}

exports.moveBackDialog = function(test)
{
    teamSetup.moveBackDialog(function(val)
    {
        test.done();
    })
}

exports.moveBack = function(test)
{
    teamSetup.moveBack(function(val)
    {
        test.done();
    })
}

exports.allowDrop = function(test)
{
    teamSetup.allowDrop(function(val)
    {
        test.done();
    })
}

exports.drag = function(test)
{
    teamSetup.drag(function(val)
    {
        test.done();
    })
}

exports.drop = function(test)
{
    teamSetup.drop(function(val)
    {
        test.done();
    })
}

exports.dialogMessage = function(test)
{
    teamSetup.dialogMessage(title, mesg, function(val)
    {
        test.done();
    })
}