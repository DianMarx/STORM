/**
 * Created by Dian on 15/07/28.
 */

function shuffle(numSubj, numTeams){
    var totSubjects = $('.subject').length;
    var shuffleChoice;
    var numSubjects = numSubj;
    var numOfTeams = numTeams;
    var max = totSubjects/numOfTeams;
    var even = false;
    var remaining = 0;
    //Get user's Choice for Shuffling
    shuffleChoice = $('input[name="shuffleRad"]:checked').val();
    if(max % 1 == 0) even = true;
    else {

        temp = max - Math.floor(max);

        remaining = Math.ceil(temp * numOfTeams);
        max = Math.ceil(max);

    }
    var unitArray = [numSubjects];
    var counter = 0;
   //Still Testing
    //Sort
    $('.names').children().each(function(index, element) {
            unitArray[counter] = element;
        counter++;
    });
    unitArray.sort(function (a, b) {
        if (a.innerHTML > b.innerHTML) {
            return 1;
        }
        if (a.innerHTML < b.innerHTML) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    //Populate Teams
    if(shuffleChoice == 1)
    {
        var countSubj = 1;

        for(i=0;i<numSubjects;i++)
        {
            if($('.' + countSubj).children("div").length < max){
                $(unitArray[i]).appendTo('.' + countSubj);
                if($('.' + countSubj).children("div").length == max)
                {countSubj++}
            }

        }
    }else if(shuffleChoice == 0)
    {
        var countSubj = 1;

        for(i=0;i<numSubjects;i++)
        {
            var inserted = false;
            while(!inserted) {
                if ($('.' + countSubj).children("div").length < max) {
                    $(unitArray[i]).appendTo('.' + countSubj);
                    countSubj++;
                    inserted = true;
                }
                else {
                    countSubj++;
                    inserted = false;

                }

                if (countSubj > numOfTeams) countSubj = 1;
            }
        }
    }

}
