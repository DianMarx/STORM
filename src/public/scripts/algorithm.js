
function randomize(numSubj, numTeam){

    numSubjects = numSubj, numTeams = numTeam;
    var max = numSubjects/numTeams;
    var even = false;
    var remaining = 0;
    if(max % 1 == 0)  even = true;
    else {
        temp = max - Math.floor(max);
        remaining = Math.ceil(temp * numTeams);
        max = Math.ceil(max);

    }
    var trueMax = max;

    $('.names').children().each(function(index, element) {

        var done = false;
        while(done != true){
            var randm = Math.floor(Math.random() * (numTeams) + 1);

            if($('.' + randm).children().length < max){

                $(element).appendTo('.' + randm); done = true;

                if($('.' + randm).children().length == max)
                {remaining--; if(remaining == 0) max = trueMax-1;}

            } else if(remaining == 0) max = trueMax-1;


        }
    });
}