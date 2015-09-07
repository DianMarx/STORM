/**
 * Created by Andreas on 2015/07/08.
 */

var numTeamGroups = 1; //Including add div, so technically numTeamGroups-1 drop able groups.
var testUser = false;
var user;
$(document).ready(function(e) {


    if (typeof sessionStorage === 'undefined') {
        testUser = true;
    }
    else {
        var user = JSON.parse(sessionStorage['User']);
        //Page Setup for user
        $("#righty").prepend(user.username + '  ');

    }
    $("input[type=submit], a, button, input[type=file]").button();

    //Moved array van subject objects
    var subjects = JSON.parse($('#jsondat').text());

    //gets all the subjects' fields
    var fields = [];
    for (var name in subjects[0]) {

        if (name[0] != '_') {
            fields.push(name);
            $('<th>' + name + '</th>').appendTo("#subjectFields");
        }
    }
    populateTable();

    //toSubjects table
    function populateTable() {

    $('#subjectsTable').empty();
    for (var i = 0; i < subjects.length; i++) {
        var sub = subjects[i];

        $('<tr>').appendTo("#subjectsTable");
        for (var p = 0; p < fields.length; p++) {
            $('<td>' + sub[fields[p]] + '</td>').appendTo("#subjectsTable");
        }
        $('</tr>').appendTo("#subjectsTable");
    }
}
    populateSubjectPool()
    $(".table").selectable();
    //Loads subject pool with first variable(name)
    function populateSubjectPool()
    {
        $('#subjects').empty();
        $('#subjects').append('<table class="table"><thead><tr class="subjHeader"><th>Name</th></tr></thead><tbody class="subjBody"></tbody></table>');
        for(var i = 0; i < subjects.length; i++)
        {
            var sub = subjects[i];
            $(".subjBody").append("<tr class='subject' id='" + sub.id + "' ><td>"+sub[fields[0]]+"</td></tr>")
        }

    }


    //User selectable fields to view
    function addField(field)
    {
        $(".subjHeader").append("<th id='" +field+"'>"+ field + "</th>");
        for(var i = 0; i < subjects.length; i++)
        {
            var sub = subjects[i];
            $("#"+sub.id).append("<td id='"+field +"'>"+sub[field]+"</td>");
        }
    }
    //Removes from all records
    function removeField(field)
    {
        $("th#"+ field).remove();
        $("td#"+ field).remove();
    }

        var div = $("<form id='selection'>Select variable to shuffle by:<br></form><br>").insertAfter("#shuffleHeading");
    for(var i = 0; i < fields.length; i++) {
        if (fields[i][0] != '_') {

        var temp = fields[i];
        div.append(' <input type="radio" name="shuffleBy" id="' + temp + '" class="shuffleBy" value="' + temp + '" /> ' + fields[i] + "<br> ");
            if(fields[i].toLowerCase() != 'name')
            $("#selectFields").append("<label class='checkbox-inline'><input class='viewBy' type ='checkbox' value='" + fields[i] + "'>" + fields[i] +"</label>");
    }
    }

    //user checks a checkbox
    $(".viewBy").change(function()
    {
        if(this.checked) {
            addField(this.value);
        }
        else
        {
            removeField(this.value);
        }
    });



//Change number of groups
    $("#totalTeams").change(function() {
        var empty = true;
        $(".teams").find("div").each(function () {

            if ($(this).find("tr").length >= 2) {
                empty = false;
            }
        });
        var c = false;
        if(!empty)
        {
            c = confirm("Warning: Changing the number of teams in this way will return all the subjects to the subject lis1.\n Continue?");
        }
        if(empty || c){
            $(".subject").detach().appendTo("#subjects table .subjBody");
            $(".teamTables").detach();
            numTeamGroups = 1;
            var temp = parseInt($("#totalTeams").val());
            for(var r = 0; r < temp; r++){
            $("#plusButton").click();}
        }
    });




    $('#randomize').click(function(e) {
        randomize($('.names').children().length,numTeamGroups-1);
    });
//Shuffling Algorithm---------------------------------------------------------------------------------------------------------------
    $('#shuffle').click(function(e) {
        //var parameter = $(".shuffleBy:checked").val();
        //alert(parameter);
        //shuffle($('.names').find('.subjBody').children().length,numTeamGroups-1,subjects);
        similarShuffle(subjects,numTeamGroups,'Name');
    });

    $("#plusButton").click(function(e){

            var temp = '<table class="table" id="tables"><thead><tr class="subjHeader"><th>Name</th></tr></thead><tbody  class="subjBody"></tbody></table>';
            $("<div class='teamTables "+(numTeamGroups)+"''><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'>"+temp+"</div>").insertBefore($("#teamAdd"));
            numTeamGroups++;
            $("#totalTeams").val(numTeamGroups-1);


        $('.teamTables').dblclick(function(){

            var isDisabled = $(this).draggable('option', 'disabled');
            if(isDisabled)
                makeDraggable(this);
            else
                disableDrag(this);
        });

        $(".teamTables").droppable({
            accept: '.subject',
            cursor: "normal",
            drop: function(event, ui) {
                //var temp = alert();
                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
            }
        });
        $('.teamTables').draggable({
            containment:'parent'
        });
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
            if (parent.find("tr").length >= 2){
                moveBackDialog($(this));
                $(".leftArrow").off();

                $(".leftArrow").on("click", function(e){
                    var parent = $(this).parent();
                    if (parent.find("tr").length >= 2){
                        moveBackDialog($(this));
                    }
                });
            }
        });
    });

    $(".minusButton").on("click", function(e){
        var parent = $(this).parent();
        if (parent.find("tr").length >= 2){
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
        if (parent.find("tr").length >= 2){
            moveBackDialog($(this));
        }
    });

    $("#plusButton").click();
    $("#plusButton").click();

    //dragable

    var k = {};
    $(".subject").draggable({

        helper: "clone",
        cursor: "move",
        opacity: "0.5",
        revert: "invalid",
        start: function(){
            k.tr = this;
        }

    });

    $(".teamTables").droppable({
        accept: '.subject',
        cursor: "normal",
        drop: function(event, ui) {
            //var temp = alert();
            $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
        }
    });
    $("#subjects").droppable({
        accept: '.subject',
        drop: function(event, ui) {
            //var temp = alert();
            $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
        }
    });
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

function makeDraggable(t){

    $(t).draggable('enable');
}
function disableDrag(t)
{

    $(t).draggable("disable");
}

function confirmDeleteTeamTable(element)
{
    var boxID = element.attr('class');
    boxID = boxID.replace("minusButton mB", "");

    numTeamGroups--;

    $(".teams br").remove();

    $("."+boxID).find(".subjBody tr").each(function(){
        $(".names table tbody").append($(this));
    });

    $("."+boxID).remove();

    var i = 0;
    var fromHere = false;
    $(".teams").find(".teamTables").each(function(){
        i++;


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

    $("."+boxID).find(".subjBody tr").each(function(){
        $(".names table tbody").append($(this));
    });

    $("."+boxID).find('.subject').detach();

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
        if (parent.find("tr").length >= 2){
            moveBackDialog($(this));
            $(".leftArrow").off();

            $(".leftArrow").on("click", function(e){
                var parent = $(this).parent();
                if (parent.find("tr").length >= 2){
                    moveBackDialog($(this));
                }
            });
        }
    });
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
