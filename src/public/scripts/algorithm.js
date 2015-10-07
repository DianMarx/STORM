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

        function compareWeight(a,b){
            var field = 'weight';

                if (a[field] < b[field])
                    return 1;
                if (a[field] > b[field])
                    return -1;
            return 0;
        }
        algs.sort(compareWeight);
        if(i < algs.length-1)
        var  numGroups = Math.floor((algs[i].weight/totalWeight) * nGroups);
        if((numGroups % 2 == 0) && (nGroups % 2 != 0))
        numGroups+=1;

        if(i == algs.length -1) numGroups = nGroups;
        switch(algs[i].type) {
            case 'Similar':
                if (algs[i].field == "previousGroups")
                    similarGroupings(subs, numGroups);
                else
                    similarShuffle(subs, numGroups, algs[i].field);
                break;
            case 'Diverse':
                if(algs[i].field == "previousGroups")
                    diverseGroupings(subs,numGroups);
                else
                    diverseShuffle(subs,numGroups, algs[i].field);
                break;
            case 'By Roles': alert("Has yet to be implemented");
                break;

        }

    }
    sendToTables(subs);

}

function diverseGroupings(subs, numGroups){
    sortByPrev(subs);
    var t = 0;
    function gComp(a,b){


        if (a.group < b.group)
            return -1;
        if (a.group > b.group)
            return 1;

        return 0;
    }



    subs.sort(gComp);
    var lim;

    var t = subs[subs.length-1].group;

    if(t == 0) t = 2;
    lim = numGroups;
    //t is amount groups from


    var multi = t * numGroups;


    var a = 0;
    var old = subs[0].group;
    var cur = subs[0].group;
    for(var p = 0; p < subs.length; p++){

        old = cur;
        cur = subs[p].group;
        if(cur > old){a=lim; lim +=numGroups; }
        subs[p].group = ++a;

        if(a == lim)
        {
            a = lim - numGroups;
        }
    }


    diverseMerger(subs, numGroups, multi );


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

            var sim = similarity(arr, subs[i], subs);
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

        if(subs[arr[i]].group == b.group) {
            var temp = subs[arr[i]].previousGroups;

            for (var p = 0; p < b.previousGroups.length; p++) {
                //alert(temp[p] + " = " + b[p]);
                if (temp[p] == b[p]) {
                    c++;
                }

            }
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

    function gComp(a,b){


            if (a.group < b.group)
                return -1;
            if (a.group > b.group)
                return 1;

        return 0;
    }


    subs.sort(compare);
    subs.sort(gComp);
    var lim;

    var t = subs[subs.length-1].group;


    lim = numGroups;
    //t is amount groups from

    var multi = t * numGroups;
    if(t == 0)
    multi = numGroups;



    var a = 0;
    var old = subs[0].group;
    var cur = subs[0].group;
    for(var p = 0; p < subs.length; p++){

        old = cur;
        cur = subs[p].group;
        if(cur > old){a=lim; lim +=numGroups; }
        subs[p].group = ++a;

        if(a == lim)
        {
            a = lim - numGroups;
        }
    }

    diverseMerger(subs, numGroups, multi);


}
function diverseMerger(subs, numGroups, tempNum)
{
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

    var t = tempNum/numGroups;

    for(var p = 0; p< subs.length; p++)
    {
        var temp = t;
        var g = 1;
        while(temp < subs[p].group)
        {temp += t; g++;}

        subs[p].group = g;

    }
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

        $('#' + subs[i].id+"group").appendTo(to);
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

function randomize(subs, numTeams){

    var numSubj = subs.length;
    var arr = [];
    for(var w = 0; w <= numTeams; w++){
        arr.push(0);
    }
    for(var i = 0; i < numSubj; i++){
        arr[subs[i].group]++;
    }
    //alert(numSubj + " teams: " + numTeam);

    var max = numSubj/numTeams;
    var even = false;
    var remaining = 0;
    if(max % 1 == 0)  even = true;
    else {

        var temp = max - Math.floor(max);

        remaining = Math.ceil(temp * numTeams);
        //alert(temp + " " + remaining);
        max = Math.ceil(max);

    }

    var trueMax = max;

    for(var q = 0; q < numSubj; q++) {

        if(subs[q].group == 0){
        var done = false;
        while(!done) {
            var randm = Math.floor(Math.random() * (numTeams) + 1);
            alert(randm + " " +arr[randm]);
            if (arr[randm] < max) {
                //alert(randm + " " + max + " " + remaining + " " + $('.' + randm).children("div").length);
                subs[q].group = randm;
                arr[randm]++;
                done = true;

                if (arr[randm] == max-1) {
                    if (!even) {
                        if (remaining > 0)remaining--;
                        if (remaining == 0) max = trueMax - 1;
                    }
                }

            }
        }
        }
        }
    sendToTables(subs);

}