
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
    $('.names').children().each(function(index, element) {
alert(index + " " + element);
        var done = false;
        while(!done){
            var randm = Math.floor(Math.random() * (numTeams) + 1);

            if($('.' + randm).children("div").length < max){
                alert(randm + " " + max + " " + remaining + " " + $('.' + randm).children("div").length);
                $(element).appendTo('.' + randm); done = true;

                if($('.' + randm).children("div").length == max)
                {if(!even){if(remaining > 0)remaining--; if(remaining ==0) max = trueMax-1;}}

            }

        }
    });
}