/**
 * Created by Dian on 15/07/28.
 */

function shuffle(numSubj, numTeams){

    var totSubjects = $('.subject').length;

    var numSubjects = numSubj;
    var numOfTeams = numTeams;
    var max = totSubjects/numOfTeams;
    var even = false;
    var remaining = 0;
    if(max % 1 == 0) even = true;
    else {

        temp = max - Math.floor(max);

        remaining = Math.ceil(temp * numOfTeams);
        max = Math.ceil(max);

    }
    var arrayLength = numSubjects;
    var unitArray = [];
    var trueMax = max;

   //Still Testing
    $('.names').children().each(function(index, element) {
        var done = false;
        var counter = 0;
        while(!done){
         //   unitArray[counter] = element;
            $(element).appendTo(unitArray[counter]);

            window.alert(counter);
            window.alert(unitArray[counter]);
            counter++;
            if (counter >= 7) done=true;
        };
    });

}