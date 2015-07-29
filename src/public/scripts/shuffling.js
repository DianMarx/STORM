/**
 * Created by Dian on 15/07/28.
 */

function shuffle(numSubj, numTeams){
    var totSubjects = $('.subject').length;
    var shuffleChoice = 3;
    var numSubjects = numSubj;
    var numOfTeams = numTeams;
    var max = totSubjects/numOfTeams;
    var even = false;
    var remaining = 0;
    //Get user's Choice for Shuffling
    shuffleChoice = $('input[name="shuffleS"]:checked').val();

    if(max % 1 == 0) even = true;
    else {

        temp = max - Math.floor(max);

        remaining = Math.ceil(temp * numOfTeams);
        max = Math.ceil(max);

    }
    var arrayLength = numSubjects;
    var unitArray = [arrayLength];
    var trueMax = max;
    var counter = 0;
   //Still Testing
    //Sort
    $('.names').children().each(function(index, element) {
            unitArray[counter] = element.innerHTML;
        counter++;
    });
    unitArray.sort();

    //Populate Teams
    for(i=0;i<numSubjects;i++)
    {
        
    }
}
