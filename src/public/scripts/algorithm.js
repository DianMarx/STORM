//main shuffle function
/*
subs contains all subjects as an object array
algs is an array specifying
        -field
        -type {diverse, simmilar, byroles, sum}
            -if type is byRoles groupArray
        -rules -numerical {max : amount} {min:amount} -minimize -maximize -strict(limits groups)
        -weight
numGroups like numTeams
 */
function goShuffle(subs, algs, numGroups)
{
    for(var i = 0; i < algs.length; i++)
    {
        switch(algs[i].type)
        {
            case 'Similar': similarShuffle(subs,numGroups, algs[i].field);
                            break;
            case 'Diverse': diverseShuffle(subs,numGroups, algs[i].field);
                break;
            case 'By Roles': alert("Has yet to be implemented");
                break;
        }
    }

}
function diverseShuffle(subs,numGroups,field)
{
    function compare(a,b) {
        if (a[field] < b[field])
            return -1;
        if (a[field] > b[field])
            return 1;
        return 0;
    }
    var numSubj = subs.length;
    subs.sort(compare);

    var allowed = getMaxes(numSubj, numGroups);
    var a = 0;
    for(var p = 0; p < subs.length; p++){
        subs[p].group = ++a;
        if(a == numGroups)
        {
            a = 0;
        }
    }
    sendToTables(subs);
}
function similarShuffle(subs,numGroups,field)
{


    //comparison function
    function compare(a,b) {
        if (a[field] < b[field])
            return -1;
        if (a[field] > b[field])
            return 1;
        return 0;
    }
    var numSubj = subs.length;
    subs.sort(compare);

    var allowed = getMaxes(numSubj, numGroups);
    var q = 0, a=0;
    for(var p = 0; p < subs.length; p++){
        subs[p].group = a+1;
        if(q < allowed[a]-1)
        {
            q++;
        }
        else {a++; q=0;}
    }
    sendToTables(subs);
}
//loads sorted to teams
function sendToTables(subs)
{
var numSubs = subs.length;
    for(var i = 0; i < numSubs; i++)
    {
        var to = $('.' + subs[i].group).find('.subjBody');

        $('#' + subs[i].id).appendTo(to);
    }
}

//helper function
function getMaxes(numSubj, numGroups){

    var max = numSubj/numGroups;

    var remaining = 0;
    if(max % 2 != 0){

        var temp = max - Math.floor(max);
        remaining = Math.floor(temp * numGroups);

    }
    max = Math.floor(max);
    var allowed = [numGroups];
    for(var i = 0; i < numGroups; i++)
    {
        allowed[i] = max;
        if(remaining > 0)
        {
            allowed[i]++;
            remaining--;
        }

    }

    return allowed;
}
function randomize(numSubj, numTeam){

    var totalSubj = $('.subject').length;
    //alert(numSubj + " teams: " + numTeam);
    var numSubjects = numSubj; var numTeams = numTeam;
    var max = totalSubj/numTeams;
    var even = false;
    var remaining = 0;
    if(max % 1 == 0)  even = true;
    else {

        temp = max - Math.floor(max);

        remaining = Math.ceil(temp * numTeams);
        //alert(temp + " " + remaining);
        max = Math.ceil(max);

    }
    var trueMax = max;
alert(max);
    $('.names').find('.subject').each(function(index, element) {
//alert(index + " " + element);
        var done = false;
        while(!done){
            var randm = Math.floor(Math.random() * (numTeams) + 1);

            if($('.' + randm).find("tr").length-1 < max){
                //alert(randm + " " + max + " " + remaining + " " + $('.' + randm).children("div").length);
                var to = $('.' + randm).find('.subjBody');
                $(element).appendTo(to); done = true;

                if($('.' + randm).find("tr").length-1 == max)
                {if(!even){if(remaining > 0)remaining--; if(remaining ==0) max = trueMax-1;}}

            }

        }
    });
}