/**
 * Created by Dian on 15/07/28.
 */

function shuffle(numSubj, numTeams, subjects){
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
    var arraySubjects = [numSubjects];
    var arrayCriteria = [numSubjects];
    var counter = 0;
   //Still Testing
    //Create arrays for sort
    $('.names').children().each(function(index, element) {
            unitArray[counter] = element;
        for (var i=0;i<numSubjects;i++){
            //window.alert(element.id + subjects[i].id);
            if(subjects[i].id == element.id){
                window.alert("In If");
                arraySubjects[counter] = subjects[i].Name;
                arrayCriteria[counter] = subjects[i].Mark;
                window.alert(subjects[i].Name+arraySubjects[counter]+arrayCriteria[counter]);
            }
        }
        counter++;
    });
    //Zip for concurrent sorting.
    var sortZip = [];
    for(var t=0;t<numSubjects;t++){
        sortZip.push({arrSubj : arraySubjects[t], arrCrit: arrayCriteria[t],unitArr: unitArray[t]});
    }

    //Sort according to criteria
    sortZip.sort(function (a, b) {
        return (a.arrCrit - b.arrCrit);
        /* if (a.arrCrit > b.arrCrit) {
            return 1;
        }
        if (a.arrCrit < b.arrCrit) {
            return -1;
        }
        // a must be equal to b
        return 0;*/
    });
    //Unzip after sorting
    var z;
    for(t=0;t<sortZip.length;t++){
        z=sortZip[t];
        arraySubjects[t] = z.arrSubj;
        arrayCriteria[t] = z.arrCrit;
        unitArray[t] = z.unitArr;
    };

    //Populate Teams
    if(shuffleChoice == 1)
    {
        var countSubj = 1;

        for(i=0;i<numSubjects;i++)
        {
            if($('.' + countSubj).children("div").length < max){
                $(unitArray[i]).appendTo('.' + countSubj);
               // $(arrayCriteria[i]).appendTo('.' + countSubj);
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
