//main shuffle function
/*
subs contains all subjects as an object array
algs is an array specifying
        -field
        -type {diverse, similar, byroles, random}
            -if type is byRoles groupArray
        -rules -numerical range -discrete strict(limits groups)
numGroups like numTeams
        -weight


        TO DO:
        UI - need at least 4 groups for 2 algs, 8 for 3, 16 for 4
 */

function goShuffle(subs, algs, nGroups)
{
    var totalWeight = 0;
    for(var p = 0; p < subs.length; p++) {
        subs[p].group = 0;
    }
    for(var z = 0; z < algs.length; z++)
    {
        totalWeight+= algs[z].weight;
    }

    for(var i = 0; i < algs.length; i++)
    {
        var  numGroups = Math.floor((algs[i].weight/totalWeight) * nGroups);
        if(i == algs.length -1) numGroups = nGroups;
        switch(algs[i].type) {
            case 'Similar':
                if (algs[i].field == "previousGroups") {

                    similarGroupings(subs, numGroups);
                } else {




                    similarShuffle(subs, numGroups, algs[i].field);
        }
                            break;
            case 'Diverse': if(algs[i].field == "previousGroups")
            {
                diverseGroupings(subs,numGroups);
            }else

                diverseShuffle(subs,numGroups, algs[i].field);
                break;
            case 'By Roles': alert("Has yet to be implemented");
                break;

        }
        alert(JSON.stringify(subs));
    }
    sendToTables(subs);

}

function diverseGroupings(subs, numGroups){
    sortByPrev(subs);
    var t = 0;
    for(var z = 0; z < subs.length; z++)
    {
        if(subs[z].group> t)t = subs[z].group;
    }


    if(t == 0){t = numGroups;}
    var multi = numGroups;
    numGroups = t * numGroups;
    var a = 0;

    for(var p = 0; p < subs.length; p++){
        var lim = t;
        if(subs[p].group > lim){a=lim; lim +=t; }
        alert(p);
        subs[p].group = ++a;

        if(a == lim)
        {
            a = lim - t;
        }

    }
    merger(subs,multi);


}

function similarGroupings(subs, numGroups){
    sortByPrev(subs);
    merger(subs,numGroups);



}

function sortByPrev(subs){

    var arr = [];
    var N = subs.length;
    arr.push(0);
    for(var i = 1; i < N; i++){
        var best = findBest(arr,subs)
        arr.push(best);
        var temp = subs[i];

        subs[i] = subs[best];
        subs[best] = temp;

    }

}


function findBest(arr, subs){

    var topIndex = 0;
    var topCompare = 0;
    var skip = false;
    for(var i = 0; i< subs.length; i++){
        skip = false;
        for(var p = 0; p < arr.length; p ++)
        {
            if(arr[p] == i){
                skip = true;
                break;
            }
        }
        if(!skip){

            var sim = similarity(arr, subs[i].previousGroups, subs);
            if(sim > topCompare){
                topIndex = i;
                topCompare = sim;
            }
        }

    }

    return topIndex;

}
function similarity(arr,b, subs){
    var c = 0;
    //alert(b);
    for(var i = 0; i < arr.length; i++){

        var temp = subs[arr[i]].previousGroups;

        for(var p = 0; p < b.length; p++){
            //alert(temp[p] + " = " + b[p]);
            if(temp[p] == b[p]){ c++;}

        }
    }
    return c;
}
function diverseShuffle(subs,numGroups,field)
{

    function compare(a,b){
    if(a.group == b.group) {
        if (a[field] < b[field])
            return -1;
        if (a[field] > b[field])
            return 1;
    }
        return 0;
    }
    var numSubj = subs.length;
    subs.sort(compare);
    var t = subs[subs.length-1].group;
    if(t == 0)t++;

    var multi = numGroups;
    numGroups = t * numGroups;
    var allowed = getMaxes(numSubj, numGroups);
    var a = 0;

    for(var p = 0; p < subs.length; p++){
        var lim = t;
        if(subs[p].group > lim){a=lim; lim +=t; }
        subs[p].group = ++a;
        if(a == lim)
        {
            a = lim - t;
        }
    }
    merger(subs, multi);


}
function merger(subs,numGroups){
    var field = 'group';
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
    for(var p = 0; p < numSubj; p++){

        subs[p].group = a+1;
        if(q < allowed[a]-1)
        {
            q++;
        }
        else {a++; q=0;}
    }
}
function similarShuffle(subs,numGroups,field)
{


    //comparison function
    function compare(a,b) {
        if(a.group == b.group) {
            if (a[field] < b[field])
                return -1;
            if (a[field] > b[field])
                return 1;
        }
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