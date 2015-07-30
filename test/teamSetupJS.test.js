/**
 * Created by Shaun on 2015-07-30.
 */

var teamSetup = require('../src/public/scripts/teamSetupJS.js');

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