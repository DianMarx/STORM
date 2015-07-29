/**
 * Created by Andreas on 2015/07/08.
 */

var numTeamGroups = 1; //Including add div, so technically numTeamGroups-1 drop able groups.

$(document).ready(function(e) {

    $( "input[type=submit], a, button, input[type=file]" ).button();

    document.getElementById("CSVInput").onchange = function(e){

        var myFileInput = document.getElementById('CSVInput');
        var myFile = myFileInput.files[0];

        var file = document.getElementById('CSVInput').files[0];
        if (file) {
            // create reader
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(e) {
                var result = e.target.result;   // browser completed reading file
                $("#dialog-confirm").html("Successfully read the contents of the file.");

                // Define the Dialog and its properties.
                $("#dialog-confirm").dialog({
                    resizable: false,
                    modal: true,
                    title: "Success",
                    height: 250,
                    width: 400,
                    buttons: {
                        "Ok": function () {
                            $(this).dialog('close');
                        }
                    },
                    show: { effect: "scale", duration: 250 },
                    hide: { effect: "scale", duration: 250 }
                });

                var arrayOfTheInput = result.split("\r\n");       //Splits the values from file into array
                var headings = arrayOfTheInput[0].split(",");

                document.getElementById("subjects").innerHTML = "";

                var JSONObject = []; //Hierdie is die JSON object wat in die DB gestoor gaan word.

                for(i = 1; i < arrayOfTheInput.length-1; i++)
                {
                    var line = arrayOfTheInput[i].split(",");

                    tempObj = {};
                    for (var k = 0; k < headings.length; k++)
                    {
                        if (typeof line[k] == 'undefined')
                        {
                            tempObj[headings[k]] = "";
                        }
                        else
                            tempObj[headings[k]] = line[k];
                    }
                    JSONObject.push(tempObj);
                }

                for(i = 0; i < JSONObject.length; i++)
                {
                    document.getElementById("subjects").innerHTML += "<div class='subject' id='" + (i+1) + "' draggable='true' ondragstart='drag(event)'>"+ JSONObject[i]["Name"] +"</div>";
                }

                //alert(JSON.stringify(JSONObject));
            };
        }
    }

    $("#totalTeams").change(function(){
        var empty = true;
        $(".teams").find("div").each(function(){

            if ($(this).find("div").length >= 1)
            {
                empty = false;
            }
        });

        if (!empty)
        {
            buttons = {
                "Yes": function () {
                    var numTeams = numTeamGroups;
                    for (var i = 1; i < numTeams; i++)
                    {
                        var element = $("."+ 1).find("img");
                        confirmDeleteTeamTable(element);
                    }

                    for(var i = 0; i < $("#totalTeams").val(); i++)
                    {
                        if(numTeamGroups % 3 == 0 && numTeamGroups != 0) {
                            $("<div class='teamTables "+(numTeamGroups)+"' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'></div>").insertBefore($("#teamAdd"));
                            $("<br><br>").insertBefore($("#teamAdd"));
                            numTeamGroups++;

                        }
                        else{
                            $("<div class='teamTables "+(numTeamGroups)+"' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'></div>").insertBefore($("#teamAdd"));
                            numTeamGroups++;
                        }
                    }

                    $(".minusButton").off();

                    $(".minusButton").on("click", function(e){
                        var parent = $(this).parent();
                        if (parent.find("div").length >= 1){
                            fnOpenNormalDialog($(this));
                        }
                        else
                        {
                            confirmDeleteTeamTable($(this));
                            $("#totalTeams").val(numTeamGroups-1);
                        }
                    });

                    $(".leftArrow").off();

                    $(".leftArrow").on("click", function(e){
                        var parent = $(this).parent();
                        if (parent.find("div").length >= 1){
                            moveBackDialog($(this));
                            $(".leftArrow").off();

                            $(".leftArrow").on("click", function(e){
                                var parent = $(this).parent();
                                if (parent.find("div").length >= 1){
                                    moveBackDialog($(this));
                                }
                            });
                        }
                    });

                    $("#totalTeams").val(numTeamGroups-1);

                    $(this).dialog('close');
                },
                "No": function () {
                    $("#totalTeams").val((numTeamGroups-1));
                    $(this).dialog('close');
                }
            };

            dialogMessage("Change total team boxes", "There are subjects in some of the team boxes.<br>Changing this value will move all participants back to the spawn pool.<br><br>Are you sure you want to continue?<br>HINT: You can add and remove team boxes to the right.",buttons);
            $("#dialog-confirm").html();
        }
        else
        {
            var numTeams = numTeamGroups;
            for (var i = 1; i < numTeams; i++)
            {
                var element = $("."+ 1).find("img");
                confirmDeleteTeamTable(element);
            }

            for(var i = 0; i < $("#totalTeams").val(); i++)
            {
                if(numTeamGroups % 3 == 0 && numTeamGroups != 0) {
                    $("<div class='teamTables "+(numTeamGroups)+"' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'></div>").insertBefore($("#teamAdd"));
                    $("<br><br>").insertBefore($("#teamAdd"));
                    numTeamGroups++;

                }
                else{
                    $("<div class='teamTables "+(numTeamGroups)+"' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'></div>").insertBefore($("#teamAdd"));
                    numTeamGroups++;
                }
            }

            $(".minusButton").off();

            $(".minusButton").on("click", function(e){
                var parent = $(this).parent();
                if (parent.find("div").length >= 1){
                    fnOpenNormalDialog($(this));
                }
                else
                {
                    confirmDeleteTeamTable($(this));
                    $("#totalTeams").val(numTeamGroups-1);
                }
            });

            $(".leftArrow").off();

            $(".leftArrow").on("click", function(e){
                var parent = $(this).parent();
                if (parent.find("div").length >= 1){
                    moveBackDialog($(this));
                    $(".leftArrow").off();

                    $(".leftArrow").on("click", function(e){
                        var parent = $(this).parent();
                        if (parent.find("div").length >= 1){
                            moveBackDialog($(this));
                        }
                    });
                }
            });

            $("#totalTeams").val(numTeamGroups-1);
        }
    });

    $("#totalTeams").val((numTeamGroups-1));

    $('#randomize').click(function(e) {
        randomize($('.names').children().length,numTeamGroups-1);
    });
//Shuffling Algorithm---------------------------------------------------------------------------------------------------------------
    $('#shuffle').click(function(e) {
        shuffle($('.names').children().length,numTeamGroups-1);
    });

    $("#plusButton").click(function(e){
        if(numTeamGroups % 3 == 0 && numTeamGroups != 0) {
            $("<div class='teamTables "+(numTeamGroups)+"' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'></div>").insertBefore($("#teamAdd"));
            $("<br><br>").insertBefore($("#teamAdd"));
            numTeamGroups++;
            $("#totalTeams").val(numTeamGroups-1);
        }
        else{
            $("<div class='teamTables "+(numTeamGroups)+"' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'></div>").insertBefore($("#teamAdd"));
            numTeamGroups++;
            $("#totalTeams").val(numTeamGroups-1);
        }

        $(".minusButton").off();

        $(".minusButton").on("click", function(e){
            var parent = $(this).parent();
            if (parent.find("div").length >= 1){
                fnOpenNormalDialog($(this));
            }
            else
            {
                confirmDeleteTeamTable($(this));
                $("#totalTeams").val(numTeamGroups-1);
            }
        });

        $(".leftArrow").off();

        $(".leftArrow").on("click", function(e){
            var parent = $(this).parent();
            if (parent.find("div").length >= 1){
                moveBackDialog($(this));
                $(".leftArrow").off();

                $(".leftArrow").on("click", function(e){
                    var parent = $(this).parent();
                    if (parent.find("div").length >= 1){
                        moveBackDialog($(this));
                    }
                });
            }
        });
    });

    $(".minusButton").on("click", function(e){
        var parent = $(this).parent();
        if (parent.find("div").length >= 1){
            fnOpenNormalDialog($(this));
        }
        else
        {
            confirmDeleteTeamTable($(this));
            $("#totalTeams").val(numTeamGroups-1);
        }
    });

    $(".leftArrow").on("click", function(e){
        var parent = $(this).parent();
        if (parent.find("div").length >= 1){
            moveBackDialog($(this));
        }
    });

    $("#plusButton").click();
    $("#plusButton").click();
});

//End of on document load


function fnOpenNormalDialog(element) {

    buttons = {
        "Yes": function () {
            $(this).dialog('close');
            $("#totalTeams").val(numTeamGroups-1);
            confirmDeleteTeamTable(element);
        },
        "No": function () {
            $(this).dialog('close');
        }
    };

    dialogMessage("Confirm delete", "Are you sure you want to delete this team box?<br>Subjects will be returned to spawn pool.", buttons);
    $("#dialog-confirm").html();
}

function confirmDeleteTeamTable(element)
{
    var boxID = element.attr('class');
    boxID = boxID.replace("minusButton mB", "");

    numTeamGroups--;

    $(".teams br").remove();

    $("."+boxID).find("div").each(function(){
        $(".names").append($(this));
    });

    $("."+boxID).remove();

    var i = 0;
    var fromHere = false;
    $(".teams").find(".teamTables").each(function(){
        i++;
        if (i % 3 == 0)
        {
            $("<br/><br/>").insertAfter($(this));
        }

        if ((i) == boxID)
            fromHere = true;

        if (fromHere)
        {
            $(this).removeClass((i+1).toString());
            $(this).addClass(boxID.toString());
            $(this).children(".minusButton").removeClass("mB"+(i+1).toString());
            $(this).children(".minusButton").addClass("mB"+boxID.toString());
            $(this).children(".leftArrow").removeClass("lA"+(i+1).toString());
            $(this).children(".leftArrow").addClass("lA"+boxID.toString());
            boxID++;
        }
    });
}

function moveBackDialog(element) {

    buttons = {
        "Yes": function () {
            $(this).dialog('close');
            moveBack(element);
        },
        "No": function () {
            $(this).dialog('close');
        }
    };

    dialogMessage("Confirm move", "Move back all subjects in this team?<br>Subjects will be returned to spawn pool.", buttons);
    $("#dialog-confirm").html();
}

function moveBack(element){
    var boxID = element.attr('class');
    boxID = boxID.replace("leftArrow lA", "");

    $("."+boxID).find("div").each(function(){
        $(".names").append($(this));
    });

    $("."+boxID).html('<img src="images/minus_button.png" class="minusButton mB'+boxID+'" alt="plus" height="25" width="25"><img src="images/left_arrow.png" class="leftArrow lA'+boxID+'" alt="move back" height="25" width="25">');

    $(".minusButton").off();

    $(".minusButton").on("click", function(e){
        var parent = $(this).parent();
        if (parent.find("div").length >= 1){
            fnOpenNormalDialog($(this));
        }
        else
        {
            confirmDeleteTeamTable($(this));
            $("#totalTeams").val(numTeamGroups-1);
        }
    });

    $(".leftArrow").off();

    $(".leftArrow").on("click", function(e){
        var parent = $(this).parent();
        if (parent.find("div").length >= 1){
            moveBackDialog($(this));
            $(".leftArrow").off();

            $(".leftArrow").on("click", function(e){
                var parent = $(this).parent();
                if (parent.find("div").length >= 1){
                    moveBackDialog($(this));
                }
            });
        }
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

//Dynamic dialog message box.
function dialogMessage(title,mesg, buttons) {
    $("#dialog-confirm").html(mesg);

    // Define the Dialog and its properties.
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: title,
        height: 250,
        width: 400,
        buttons: buttons,
        show: { effect: "scale", duration: 250 },
        hide: { effect: "scale", duration: 250 }
    });
}