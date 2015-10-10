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
        if(algs[z].type != 'By Roles')
        totalWeight+= algs[z].weight;
    }

    function compareWeight(a,b){
        var field = 'weight';

        if (a[field] < b[field])
            return 1;
        if (a[field] > b[field])
            return -1;
        return 0;
    }
    algs.sort(compareWeight);
    for(var i = 0; i < algs.length; i++)
    {


        if(i < algs.length-1)
        var  numGroups = Math.floor((algs[i].weight/totalWeight) * nGroups);
        if((numGroups % 2 == 0) && (nGroups % 2 != 0))
        numGroups+=1;

        if(i == algs.length -1){ numGroups = nGroups;}
        else if(algs[i+1].type = "By Roles") numGroups = nGroups;
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
            case 'By Roles': if(i == 0) similarShuffle(subs,numGroups, algs[i].field);

                byRoles(subs,algs[i].roles, algs[i].mins,algs[i].maxes, numGroups, algs[i].field);
                break;

        }

    }
    sendToTables(subs);

}

function byRoles(subs,roles, mins, maxes, numGroups, field)
{
    //alert("YOLO");
   //unlock all subjects
    for(var t = 0; t < subs.length; t++){
        subs[t].locked = false;
    }
    //alert(JSON.stringify(subs));
    //currentLocked is used to map how many of each role has been confirmed in each group
    var currentLocked = [];

    for(var x = 0; x < roles.length; x++){
        var tempArr = [];
        for(var y = 0; y < numGroups; y++){
            tempArr.push(0);}
    currentLocked.push(tempArr);
    }

    //alert(JSON.stringify(currentLocked));


    var minLimits = [roles.length];
    var maxLimits = [roles.length];
    var highMax = 0;
    for(var l = 0; l < roles.length; l++)
    {
        roles[l] = roles[l].replace("_", " ");
        minLimits[l] = mins[l] * numGroups;
        maxLimits[l] = maxes[l] * numGroups;
        if(maxes[l] > highMax) highMax = maxes[l];
    }
    alert("yolo");
    //loop over the rest until done
    var done = false;
    var iteration = 1;
    var gaveleft = false;
    var gaveright = false;
    var got = [];
    for(var x = 0; x < roles.length; x++)
    {
        got.push(false); //has the role been gotten in this itteration
    }
    while(!done){
        var group = 0;


        for(var i = 0; i < subs.length; i++){


            if(group != subs[i].group){gaveleft = false; gaveright = false;
                for(var f = 0; f< got.length; f++)
                {
                    got[f] = false; //haven't gotten anything for this group in this iteration
                }
                group = subs[i].group;

            }
            var gave = false; //this subj hasn't been given away yet

            for(var a = 0; a < roles.length; a++){
                if(roles[a] == subs[i][field] && subs[i].locked == false){
                    var bool = false;
                    if(group > 1) {
                        if (currentLocked[a][group - 1] > currentLocked[a][group - 2] &&  !bool) {

                            giveLeft(subs, i, group, field, currentLocked[a][group - 1]);
                            bool = true;
                            gaveleft = true;
                            gave = true;
                            i--;
                            break;
                        }
                    }
                    if(group < numGroups && !gave){
                        if (currentLocked[a][group - 1] > currentLocked[a][group] && !bool){
                           // alert("Hierr");
                           //giveRight(subs,a,group,field);
                           //bool = true;
                            //gaveright = true;
                            //gave = true;
                        }
                    }
                    if(currentLocked[a][group-1] < maxes[a] && !got[a] && !bool)
                        {
                            //alert(group + " "+currentLocked[a][group-1] +" " + maxes[a]);
                            if(group > 1)
                            {
                                if(currentLocked[a][group-2] >= currentLocked[a][group-1]){
                                    subs[i].locked = true;
                                    currentLocked[a][group-1]++;
                                    got[a] = true;
                                }
                            }
                            else
                            {
                                if(currentLocked[a][group] >= currentLocked[a][group-1]){
                                    subs[i].locked = true;
                                    currentLocked[a][group-1]++;
                                    got[a] = true;
                                }
                            }
                            break;
                        }


                }
            }
        }

        if(iteration == (Math.pow(highMax,2) * Math.pow(numGroups,2)))
            done = true; //placeholder
        iteration++;
    }

    //document.body.innerHTML = JSON.stringify(subs);
    for(var q = 0; q < subs.length; q++){
        if(subs[q].locked == false)
        subs[q].group = 0;
    }
}

function giveRight(subs, index, group, field){


    //find startIndex and endIndex of group
    var done = false;
    var startIndex = -1;
    var endIndex = -1;
    var i = 0;

    while(i < subs.length){

        if(subs[i].group == group && startIndex == -1)
        {
            startIndex = i;

        }
        if(i == subs.length-1 && endIndex == -1){
            endIndex = i;
        }
        if(subs[i].group > group && endIndex == -1 ){

            endIndex = i - 1;
        }
        i++;
    }
    //alert(startIndex + " " + endIndex);

    i = index;
    while(i < endIndex)
    {
        if(subs[i][field] == subs[index][field] && subs[i].locked == false)
        index = i;
        i++;
    }

    i = index;
    //put index in lowest
    while(i < endIndex -1)
    {
        var tempSub = subs[i];
        subs[i] = subs[i+1];
        subs[i+1] = tempSub;
        i++;
    }
    index = endIndex;
    var next = endIndex+1;
    while(subs[next].locked == true){
        next++;
    }
    i = next;
    while(i > endIndex+1)
    {
        var tempSub = subs[i];
        subs[i] = subs[i-1];
        subs[i-1] = tempSub;
        i--;
    }
    next = endIndex+1;
    var tempSub = subs[index];
    var tempGroup = subs[index].group;
    subs[index] = subs[next];
    subs[next] = tempSub;
    subs[next].group = subs[index].group;
    subs[index].group = tempGroup;


}

function giveLeft(subs, index, group, field, preds){


    //find startIndex and endIndex of group
    var done = false;
    var startIndex = -1;
    var endIndex = -1;
    var i = 0;
    while(i < subs.length){
        if(subs[i].group == group && startIndex == -1)
        {
            startIndex = i;

        }
        if(i == subs.length-1&& endIndex == -1){
            endIndex = i;
        }
        if(subs[i].group == group + 1 && endIndex == -1 ){
            endIndex = i - 1;
        }
        i++;
    }
//alert(JSON.stringify(subs[index]));
    i = 0;
    var temp = 0;
    var one = -1;
    var two = -1;

    while(i < preds){
        temp = one+1;
        one = -1;
        var done = false;
        //find the indexes of the subjects to be exchanged
        while(!done){
            if(subs[temp][field] == subs[index][field])
            {
                if(one ==-1)
                {
                    one = temp;
                }else{ two = temp; done = true;}
            }
            temp++;
        }
        //swap em
        var tempSub = subs[one];
        subs[one] = subs[two];
        subs[two] = tempSub;
        subs[one].locked = true;
        subs[two].locked = false;

        i++;
    }
    //alert(startIndex);
//put the current sub at the top of the group
    i = index;
    while(i > startIndex){
        var tempSub = subs[i];
        subs[i] = subs[i-1];
        subs[i-1] = tempSub;
        i--;
    }
    i--;

    while(subs[i].locked != false){
        i--;
        //(i);

    }

    var tempGroup = subs[startIndex].group;  //sI = 2
    var tempSub = subs[startIndex];
    subs[startIndex] = subs[i]; //i = 1
    subs[i] = tempSub;
    subs[i].group = subs[startIndex].group;
    subs[startIndex].group = tempGroup;
    while(subs[i+1].group == subs[i].group)
    {

        tempSub = subs[i+1];
        subs[i+1] = subs[i];
        subs[i] = tempSub;
        i++;
    }

    function gComp(a,b){


        if (a.group < b.group)
            return -1;
        if (a.group > b.group)
            return 1;

        return 0;
    }



    subs.sort(gComp);
    alert(JSON.stringify(subs[i]) +" " + JSON.stringify(subs[startIndex]));


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