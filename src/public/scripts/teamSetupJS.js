var numTeamGroups = 1; //Including add div, so technically numTeamGroups-1 drop able groups.
var testUser = false;
var user;
var collection = getParameterByName('collection');
var subjects;
var oldSubjects = [];
var numAlgs = 0;
var fields = [];
var oldFields = [];
var numManipulations = 0;
var viewFields = [];
var viewCriteria = [];


$(document).ready(function(e) {

    //Glyph Icon Color
    //change add(plus) glyph color on hover
    $(document).on("mouseenter", ".addAlg", function() {
        $(this).css("color","lime");
    });
    $(document).on("mouseleave", ".addAlg", function() {
        $(this).css("color","black");
    });

    $("CancelChanges").button("disable");
    $("saveMasterToDB").button("disable");

    $("#uploadCSV").click(function(){
        $("#CSVInput").click();
    });

    $("#CSVInput").change(function(){
        uploadCSV();
    });

    $("#logOutBtn").click(function(){
        if (confirm('Are you sure you want to logout?'))
            location.href = "/";
    });

    $("#MyProjectsPage").click(function(){
        if (confirm('Quit without saving?'))
            location.href = "/projectHome";
    });

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
    subjects = JSON.parse($('#jsondat').text());
    var x = 0;
    while(x < subjects.length)
    {
        subjects[x].group = 0;
        x++;
    }
    //gets all the subjects' fields
    fields = [];
    for (var name in subjects[0]) {

        if (name[0] != '_' && name != 'id') {
            fields.push(name);
            //$('<th>' + name + '</th>').appendTo("#subjectFields");
        }
    }

    var tempGroup = subjects[0].previousGroups;

    if(tempGroup != null && subjects[0].previousGroups.length > 0)
    {
        for(var b = 0; b < subjects[0].previousGroups.length; b++)
        {
            $("#iterationSelect").append("<option  value='"+b+" '>"+b+"</option>");
        }
    }

    $('#loadIteration').click(function(){

        var largest = 0;
        var tempp = parseInt($("#iterationSelect option:selected").val());
        returnToPool();
        if(tempp != null){
            for(var c = 0; c < subjects.length; c++)
            {

                subjects[c].group = subjects[c].previousGroups[tempp];
                if(subjects[c].group > largest)
                    largest = subjects[c].group;
            }
        }

        while(numTeamGroups-1 < largest)
            $("#plusButton").click();
        sendToTables(subjects);
        GroupsChanged();
    });
    //alert(JSON.stringify(fields));
    //alert(JSON.stringify(subjects));
    populateTable();
    //toSubjects table


    $(".table").selectable();

    //Loads subject pool with first variable(name)
    loadViewBy();

    //Change number of groups
    $("#totalTeams").change(function() {
        var empty = false;
        if(getNumTeams(subjects) == 0)
            empty = true;
        var c = false;
        if(!empty)
        {
            c = confirm("Warning: Changing the number of teams in this way will return all the subjects to the subject list.\n Continue?");
        }
        if(empty || c){
            returnToPool();
            var temp = parseInt($("#totalTeams").val());
            $("#maxPerGroup").val(Math.ceil(subjects.length/temp));
            for(var r = 0; r < temp; r++){
                $("#plusButton").click();}
        }
    });
    function returnToPool(){
        $(".subject").detach().appendTo("#subjects table .subjBody");
        $(".teamTables").detach();
        numTeamGroups = 1;
        for(var p = 0; p < subjects.length; p++){
            subjects[p].group = 0;
        }
    }
    function updateTeams()
    {

    }

//Shuffling Algorithm---------------------------------------------------------------------------------------------------------------
    $('#shuffle').click(function(e) {
        //var parameter = $(".shuffleBy:checked").val();
        //alert(parameter);
        //shuffle($('.names').find('.subjBody').children().length,numTeamGroups-1,subjects);

        var algs = [];
        var i = 0;
        var exit = false;
        $('.algPart').each(function(){
            var alg = new Object();
            alg.field = $(this).find('#selectField option:selected').val();
            alg.type = $(this).find('#shuffleSelect option:selected').val();
            if(alg.type == 'By Roles'){
                alg.roles = [];
                alg.mins = [];
                alg.maxes = [];
                //var c = 0;
                $(this).find('tbody > tr').each(function(){
                    var temp = $(this).text();
                    temp = temp.replace(' ','_');;
                    alg.roles.push(temp);
                    alg.mins.push($(this).find("#"+temp+"Min").val());
                    alg.maxes.push($(this).find("#"+temp+"Max").val());
                    if(alg.mins > alg.maxes)
                    {

                        exit = true;

                    }

                    //c++;
                });
                alg.weight = -1;
                alg.strict = $('input[name=strict]:checked', '#strictForm').val();
                /*test
                 for(var k = 0; k < c; k++){
                 alert(alg.roles[k] + " "+ alg.mins[k] + " " + alg.maxes[k]);
                 }
                 */
                //alert(alg.strict);
            }else
                alg.weight = parseInt($(this).find('#weight').val());
            algs.push(alg);
        });
        if(exit)
        {
            alert("All role minimums must be less than their maximums");
            return;
        }
        goShuffle(subjects,algs,numTeamGroups-1);
        GroupsChanged();
    });

    $("#plusButton").click(function(e){

        var temp = '<table class="table" ><thead><tr class="subjHeader"><th>Name</th>';
        for(var q = 0; q < viewFields.length; q++)
        {
            temp+= '<th id = "'+viewFields[q]+'">' +  viewFields[q] + '</th>';
        }
        temp += '</tr></thead><tbody  class="subjBody" id="'+numTeamGroups+'"></tbody></table>';
        $("<div class='teamTables "+(numTeamGroups)+"''><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'>"+temp+"</div>").insertBefore($("#teamAdd"));
        numTeamGroups++;
        $("#totalTeams").val(numTeamGroups-1);



        $(".teamTables").droppable({
            accept: '.subject',
            cursor: "normal",
            drop: function(event, ui) {
                //var temp = alert();
                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
                var str = $(ui.draggable).attr('id');
                //alert(str);
                var res = str.replace("group", "");
                //alert(res);
                for( var su = 0; su < subjects.length;su++)
                {
                    if(subjects[su].id == res) {
                        subjects[su].group = $(ui.draggable).parent().attr('id');
                        //alert(subjects[su].group);
                    }


                }
                $(ui.helper).remove();
                GroupsChanged();
            }
        });
        $("#subjects").droppable({
            accept: '.subject',
            drop: function(event, ui) {
                //var temp = alert();
                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
                GroupsChanged();
                $(ui.helper).remove();
            }
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



    //dragable




    addAlgorithmBox();
    $('#addAlg').click(function (e) {
        if(Math.pow(2,numAlgs+1) <= numTeamGroups -1)
            addAlgorithmBox();
        else alert("You need at least " + Math.pow(2,numAlgs+1) + " groups to shuffle by " + (numAlgs+1) + " fields." );
    });

    //This function adds a box for selecting a field and shuffling method
    initAlgBox();

    $("#exportMasterTable").click(function (e) {
        exportCSV(subjects, fields);
    });
    $("#exportGroups").click(function (e) {


        exportCSV(subjects, fields);



    });
    $("#saveIteration").click(function (e) {


        for(var i = 0; i < subjects.length; i++) {
            if(subjects[i].previousGroups == null)
                subjects[i].previousGroups = [];
            subjects[i].previousGroups.push(subjects[i].group);

        }
        var b = subjects[0].previousGroups.length-1;
        $("#iterationSelect").append("<option  value='"+b+" '>"+b+"</option>");

        updateSubjects(subjects);
    });
    $("#returnSubjs").click(function(e){
        $(".subject").detach().appendTo("#subjects table .subjBody");
        for(var q = 0; q < subjects.length; q++){
            subjects[q].group = 0;
        }
    });
    $("#randomize").click(function(e){
        randomize(subjects, numTeamGroups-1);
    });





    $("#saveMasterToDB").click(function(e){
            updateSubjects(subjects);
            $(this).prop("disabled", true);
            $("#CancelChanges").prop("disabled", true);
        }
    );

    $("#plusButton").click();
    $("#plusButton").click();
    populateSubjectPool();
    $("#maxPerGroup").val(Math.ceil(subjects.length/2));

});

function initAlgBox()
{
    numAlgs = 0;
    numAlgs++;
    //appendTO
    var div = "<div class='algPart'><button type='button' class='close' id='closeAlg'><span aria-hidden='true'>x</span> </button> Select Field: <select name='selectField' class='form-control' id='selectField'>"
    for(var i = 0; i < fields.length; i++)
    {
        if(fields[i] != 'id')
            div+= "<option value = '" + fields[i] + "'>"  + fields[i] + "</option>";
    }
    div += "</select>";
    div += "<br>Select Shuffle type: <select name='selectType' class='form-control' id='shuffleSelect'><option value='Similar'>Similar</option><option value='Diverse'>Diverse</option></select>";
    div += "<br><div class='rules'></div><div class='weightDiv'><br>Weight: <input type='number' class='form-control' min=1 value=1 id='weight'/></div>";
    $("#shuffleRow").html(div);

    //$('#closeAlg').unbind();
    $('#closeAlg').click(function(e){
        $(this).parent().detach();
        numAlgs--;
    });

    $("#selectField").change(function(){
        var field = $(this).val();

        if(isDiscrete(field,subjects[0]))
        {

            $(this).parent().find("#byRoles").detach();
            $(this).parent().find("#shuffleSelect").append("<option id='byRoles' value='By Roles'>By Roles</option>");

        }else {
            $(this).parent().find(".weightDiv").show();
            $(this).parent().find("#byRoles").detach();
            $(this).parent().find('.roles').detach();
        }
    });
    $("#shuffleSelect").change(function(){

        $(this).parent().find('.roles').detach();
        $(this).parent().find(".weightDiv").show();
        if($(this).val() == "By Roles")
        {
            var t = $(this).parent().find(".rules");
            var div = $("<div class='roles'><h6>Roles per grouping</h6></div>").appendTo(t);
            var field = $(this).parent().find("#selectField").val();

            var arr = getDiscreteArr(field, subjects);


            var table = div.append($("<table class='rollTable'><thead><tr><th>Role</th><th>Min</th><th>Max</th></tr></thead></table>"));
            var table = table.find('.rollTable').append($("<tbody></tbody>"));
            $(arr).each(function(){
                var role = this.replace(' ','_');
                table.find('tbody:last-child').append($("<tr><td>"+this+"</td><td><input type='number' class='rollMin' min ='0' value='0' id = '"+role+"Min'></td>" +
                "<td><input type='number' class='rollMax' min ='0' value='0' id = '"+role+"Max'></td></tr>"));
            });
            $(this).parent().find(".weightDiv").hide();
        }

    });

}

function addAlgorithmBox()
{
    numAlgs++;
    var div = "<div id='AlgBox"+numAlgs+"' class='algPart' hidden><button type='button' class='close' id='closeAlg'><span aria-hidden='true'>x</span> </button> Select Field: <select name='selectField' class='form-control' id='selectField'>"
    for(var i = 0; i < fields.length; i++)
    {
        if(fields[i] != 'id')
            div+= "<option value = '" + fields[i] + "'>"  + fields[i] + "</option>";
    }
    div += "</select>";
    div += "<br>Select Shuffle type: <select name='selectType' class='form-control' id='shuffleSelect'><option value='Similar'>Similar</option><option value='Diverse'>Diverse</option></select>";
    div += "<br><div class='rules'></div><div class='weightDiv'><br>Weight: <input type='number' class='form-control' min=1 value=1 id='weight'/></div>";
    $("#shuffleRow").prepend(div);

    //highlight new algBox
    $("#AlgBox"+numAlgs).toggle("highlight");

    //$('#closeAlg').unbind();
    $('#closeAlg').click(function(e){
        $(this).parent().remove();
        numAlgs--;
    });

    $("#selectField").change(function(){
        var field = $(this).val();

        if(isDiscrete(field,subjects[0]))
        {

            $(this).parent().find("#byRoles").detach();
            $(this).parent().find("#shuffleSelect").append("<option id='byRoles' value='By Roles'>By Roles</option>");

        }else {
            $(this).parent().find(".weightDiv").show();
            $(this).parent().find("#byRoles").detach();
            $(this).parent().find('.roles').detach();
        }
    });
    $("#shuffleSelect").change(function(){

        $(this).parent().find('.roles').detach();
        $(this).parent().find(".weightDiv").show();
        if($(this).val() == "By Roles")
        {
            var t = $(this).parent().find(".rules");
            var div = $("<div class='roles'><h6>Roles per grouping</h6></div>").appendTo(t);
            var field = $(this).parent().find("#selectField").val();

            var arr = getDiscreteArr(field, subjects);


            var table = div.append($("<table class='rollTable'><thead><tr><th>Role</th><th>Min</th><th>Max</th></tr></thead></table>"));
            var table = table.find('.rollTable').append($("<tbody></tbody>"));
            $(arr).each(function(){
                var role = this.replace(' ','_');
                table.find('tbody:last-child').append($("<tr><td>"+this+"</td><td><input type='number' class='rollMin' min ='0' value='0' id = '"+role+"Min'></td>" +
                "<td><input type='number' class='rollMax' min ='0' value='0' id = '"+role+"Max'></td></tr>"));
            });
            $(this).parent().find(".weightDiv").hide();
        }

    });
}

function isDiscrete(field, sub){
    if(field.toLowerCase() != "name" && field.toLowerCase() != 'id')
    {
        if(isNumerical(sub[field]))
        {
            return false;
        }
        return true;
    }
    return false;
}

function getDiscreteArr(field, subs)
{
    var arr = new Array();
    arr.push(subs[0][field]);

    for(var i = 1; i < subs.length; i++){
        var sub = subs[i];
        var b = true;
        for(var p = 0; p < arr.length; p++){
            if(arr[p] == sub[field])
            {
                b = false;
                break;
            }
        }
        if(b == true){
            arr.push(sub[field]);
        }

    }
    return arr;
}

function isNumerical(obj){
    return !isNaN(parseFloat(obj));
}
//End of on document load
function updateSubjects(subs)
{
    //alert("this");
    $.ajax({
        type: "POST",
        url: '/updateSubjs',
        data: {data: JSON.stringify(subs), collection: collection},
        success: function ()
        {
            //this will eventually reload with new values
            //window.location = "teamsetup" +"?collection="+ collection;
        },
        error: function (e) {
            console.log(e);
        }
    });
}
function addGroupsToSubjects(subjects){
    var temp = subjects;

    return temp;
}
function exportCSV(subs, fields)
{
    var csvContent = '';
    var index = 0;
    var newFields = fields.slice(0);

    newFields.unshift('id');

    for(var i = 0; i < newFields.length; i++) {
        if (newFields[i] != 'previousGroups') {
            csvContent += newFields[i];
            csvContent += ',';
        }

    }
    csvContent = csvContent.substr(0,csvContent.length-1);
    csvContent += '\r\n';
    for(var p = 0; p < subs.length; p++)
    {
        alert(subs[p].group);
        for(var k = 0; k < newFields.length; k++)
        {   if(newFields[k] != "previousGroups") {
            csvContent += subs[p][newFields[k]];
            csvContent += ',';
        }
        }
        csvContent = csvContent.substr(0,csvContent.length-1);
        csvContent += '\r\n';
    }

    var link = document.createElement("a");
    link.href        = 'data:attachment/csv,' + encodeURIComponent(csvContent);
    link.target      = '_blank';
    link.download    = 'myFile.csv';

    document.body.appendChild(link);
    link.click();
}

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

//Removes from all records
function removeField(field)
{
    field = field.replace(' ','_');
    var index = -1;
    for(var w = 0; w < viewFields.length; w++)
    {
        if(viewFields[w] == field)
        {index = w;
        }
    }
    if(index != -1)
        viewFields.splice(index, 1);
    $("th#"+ field).remove();
    $("td#"+ field).remove();
    var elem = document.getElementById("poolChart");
    elem.parentElement.removeChild(elem);

    $('#mainChart').append("<div id='poolChart'></div>")
}

function loadViewBy()
{
    $("#selectCriteria").empty();
    for(var i = 0; i < fields.length; i++) {
        if (fields[i][0] != '_' && fields[i] != 'group') {

            var temp = fields[i];
            if(fields[i].toLowerCase() != 'name')
                $("#selectCriteria").append("<option class='viewBy' type ='checkbox' value='" + fields[i] + "'>" + fields[i] +"</option>");
        }
    }


    $("#selectFields").empty();



    $("#selectFields").html("Show fields: <br>");
    var div = $("<form id='selection'>Select variable to shuffle by:<br></form><br>").insertAfter("#shuffleHeading");
    for(var i = 0; i < fields.length; i++) {
        if (fields[i][0] != '_' /*&& fields[i] != 'previousGroups'*/) {

            var temp = fields[i];
            div.append(' <input type="radio" name="shuffleBy" id="' + temp + '" class="shuffleBy" value="' + temp + '" /> ' + fields[i] + "<br> ");
            if(fields[i].toLowerCase() != 'name')
                $("#selectFields").append("<label class='checkbox-inline'><input class='viewBy' type ='checkbox' value='" + fields[i] + "'>" + fields[i] +"</label>");
        }
    }
    //user checks a checkbox
    $('.selectpicker').on('change', function(){
        var selected = $(this).val();
        alert(selected);
        //added varible for checking if added or if removed
    });

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
        //alert("this");
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getHeadings(fields, subj)
{

    //var test

    var newFields = new Array();


    for (var i = 0; i < fields.length; i++) {
        var field = new Object();
        if (fields[i] != "previousGroups" && fields[i] != "group") {

            field.name = fields[i];

            if (isNumerical(subj[field.name])) {

                field.type = "number";
            }
            else {
                field.type = "text";
            }

            newFields.push(field);

        }
    }
    var fieldCtr = {};
    fieldCtr.type = "control";
    newFields.push(fieldCtr);

    return newFields;
}


function uploadCSV()
{
    var file = document.getElementById('CSVInput').files[0];
    if (file) {
        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {

            var result = e.target.result;   // browser completed reading file
            result = result.replace(/\r?\n|\r/g, "\r\n");

            var obj = $.csv.toObjects(result);
            var arr = $.csv.toArrays(result);

            MergeSubjects(obj,arr[0]);
        };
    }
}

function MergeSubjects(newSubjects,Criteria)
{
    var temp = [];

    for(i = 0; i < subjects.length; i++) // make deep copy of subjects to reserve integrity of data
    {
        var tmp = $.extend(true,{},subjects[i]);
        temp.push(tmp);
    }
    for(i = 0; i < subjects.length; i++) // make deep copy of temp to revert changes
    {
        var tmp = $.extend(true,{},temp[i]);
        oldSubjects.push(tmp);
    }

    for(i = 0; i < temp.length; i++)
    {
        delete temp[i]["previousGroups"];
        delete temp[i]["__v"];
        delete temp[i]["group"];
    }

    var crit = Object.getOwnPropertyNames(temp[0]);

    var valid = validCSV(newSubjects,Criteria,temp,crit);

    if(!valid)
    {
        clearInput();
        alert("Could not merge subject set. Review errors and try again.");
    }
    else
    {
        for(i = 0; i < valid.length; i++)
        {
            for(k = 0; k < subjects.length; k++)
            {
                var exists = false;
                if(subjects[k][Criteria[0]] == valid[i][Criteria[0]])
                {
                    $.extend(subjects[k],valid[i]);
                    exists = true;
                    break;
                }
            }
            if(!exists)
            {
                subjects.push(valid[i]);
            }
        }
        oldFields = fields.slice(0);
        fields = [];
        for (var name in subjects[0]) {

            if (name[0] != '_' && name != "id") {
                fields.push(name);
                //$('<th>' + name + '</th>').appendTo("#subjectFields");
            }
        }
        populateTable();
        populateSubjectPool();
        loadViewBy();
        initAlgBox();
        alert("Subject set merged successfully. Remember to save before you exit. Or cancel to discard changes");
        clearInput();

        jsTableChange();
    }
}

function jsTableChange()
{
    $("#CancelChanges").prop("disabled", false);

    $("#CancelChanges").on("click", function()
    {
        subjects = oldSubjects;
        fields = [];
        for (var name in subjects[0]) {

            if (name[0] != '_' && name != "id")
            {
                fields.push(name);
            }
        }
        populateTable();
        populateSubjectPool();
        loadViewBy();
        $("#CancelChanges").prop("disabled", true);
        $("#saveMasterToDB").prop("disabled", true);
    });

    $("#saveMasterToDB").prop("disabled", false);
}

function clearInput()
{
    var control = $("#CSVInput");
    control.replaceWith( control = control.clone( true ) );
}

function validCSV(newSubjects,Criteria,temp,fields)
{
    var numFieldsNew = Criteria.length;
    var counter = {};
    var id = Criteria[0];
    var Name = Criteria[1];
    var validNumSubs;
    var newCriteria = false;
    var moreSubs = false;
    var duplicates = false;
    var emptyCol = false;
    var errorSub;

    newSubjects.forEach(function(sub){ //count duplicates
        var key = JSON.stringify(sub[id]);
        counter[key] = (counter[key] || 0) + 1;
        if(counter[key] > 1)
        {
            alert("You cannot have duplicate ids. Duplicate id " + key + " found. Please select unique ids for new subjects.");
            duplicates = true;
            return false;
        }
    });

    if(duplicates)
        return false;



    for(i = 0; i < Criteria.length; i++)
    {
        if(Criteria[i] === "")
        {
            emptyCol = true;
            break;
        }
    }
    if(emptyCol)
    {
        alert("The file cannot have an empty column header.");
        return false;
    }
    for(i = 0; i < newSubjects.length; i++)
    {
        for(k = 0; k < numFieldsNew; k++)
        {
            if(newSubjects[i][Criteria[k]] == "")
            {
                alert("Subjects cannot have empty values. The first error occurred at subject: " + newSubjects[i][Name]);
                return false;
            }
        }
    }
    for(k = 0; k < temp.length; k++) // check if all subject ids are present
    {
        for(i = 0; i < newSubjects.length; i++)
        {
            validNumSubs = false;
            if(temp[k][id] == newSubjects[i][id])
            {

                validNumSubs = true;
                break;
            }
        }
        if(!validNumSubs)
        {
            errorSub = temp[k][Name];
            alert("Subject '"+errorSub+"' has been omitted.");
            return false;
        }
    }

    if(newSubjects.length > temp.length) // User attempting to add new subject
    {
        moreSubs = true;
    }

    for(i = 0; i < Criteria.length; i++)
    {
        if(fields.indexOf(Criteria[i]) == -1) // User wants to add new criteria
        {
            if(Criteria[i] != id)
            {
                newCriteria = true;
                //$("#selectFields").append("<label class='checkbox-inline'><input class='viewBy' type ='checkbox' value='" + Criteria[i] + "'>" + Criteria[i] +"</label>");
            }
        }
    }

    if(newCriteria)
    {
        for(k = 0; k < temp.length; k++) // for each object in temp merge with object in newSubject where ids are the same
        {
            for(i = 0; i < newSubjects.length; i++)
            {
                validNumSubs = false;
                if(temp[k][id] == newSubjects[i][id])
                {
                    $.extend(temp[k],newSubjects[i]);
                    validNumSubs = true;
                    break;
                }
            }
            if(!validNumSubs)
                break;
        }
    }

    if(moreSubs)
    {
        for(k = 0; k < fields.length; k++) //for each object in newSubjects not matching any subjects in temp, push to temp.
        {
            for (i = 0; i < Criteria.length; i++)
            {
                correctCrit = false;
                if(fields[k] == Criteria[i])
                {
                    correctCrit = true;
                    break;
                }
            }
            if(!correctCrit)
            {
                alert("Could not add new subjects, all criteria should be included");
                return false;
            }
        }

        for(k = 0; k < newSubjects.length; k++) //for each object in newSubjects not matching any subjects in temp, push to temp.
        {
            for(i = 0; i < temp.length; i++)
            {
                validNumSubs = false;
                if(temp[i][id] == newSubjects[k][id])
                {
                    validNumSubs = true;
                    break;
                }
            }
            if(!validNumSubs) // more subjects than present in current set
            {
                newSubjects[k].previousGroups = [];
                newSubjects[k].group = 0;
                temp.push(newSubjects[k]);
            }
        }
    }
    return temp;
}

function getNumTeams(subs){
    var temp = 0;
    for(var i = 0; i < subs.length; i++){
        if(subs[i].group > temp)
            temp = subs[i].group;
    }
    return temp;
}

function populateTable() {
    $(function () {


        $("#subjTable").jsGrid({
            height: "500px",
            width: "100%",

            selecting: true,
            sorting: true,
            paging: true,
            autoload: true,
            inserting: true,
            editing: true,
            onItemUpdating: function(args) {
                // cancel update of the item with empty 'name' field
                alert(JSON.stringify(args.item));
            },

            pageSize: 15,
            pageButtonCount: 5,
            rowClick: function (a) {
            },
            deleteConfirm: "Do you really want to delete the subject?",
            fields: getHeadings(fields, subjects[0]),
            controller: {
                loadData: function () {
                    return subjects
                }
            }
        });

    });
    $('.jsgrid-header-sortable').first().click();

    /*
     $('#subjectsTable').empty();
     for (var i = 0; i < subjects.length; i++) {
     var sub = subjects[i];

     $('<tr>').appendTo("#subjectsTable");
     for (var p = 0; p < fields.length; p++) {
     $('<td>' + sub[fields[p]] + '</td>').appendTo("#subjectsTable");
     }
     $('</tr>').appendTo("#subjectsTable");
     }
     */
}

function populateSubjectPool()
{
    var k = {};
    $('#subjects').empty();
    $('#subjects').append('<table class="table" ><thead><tr class="subjHeader"><th>Name</th></tr></thead><tbody class="subjBody" id="0"></tbody></table>');
    for(var i = 0; i < subjects.length; i++)
    {
        subjects[i].group = 0;
        var sub = subjects[i];
        if(sub['name']){var name= 'name';}else var name = 'Name';
        $("tbody#0").append("<tr class='subject' id='" + sub.id+"group" + "' ><td>" + sub[name] + "</td></tr>");
    }

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
            var str = $(ui.draggable).attr('id');
            //alert(str);
            var res = str.replace("group", "");
            //alert(res);
            for( var su = 0; su < subjects.length;su++)
            {
                if(subjects[su].id == res) {
                    subjects[su].group = $(ui.draggable).parent().attr('id');
                    //alert(subjects[su].group);
                }


            }
            $(ui.helper).remove();
            GroupsChanged();
        }
    });
    $("#subjects").droppable({
        accept: '.subject',
        drop: function(event, ui) {
            //var temp = alert();
            $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
            GroupsChanged();
            $(ui.helper).remove();
        }
    });

}


//User selectable fields to view

function addField(field)
{

    field = field.replace(' ','_');
    viewFields.push(field);
    $(".subjHeader").append("<th id='" +field+"'>"+ field + "</th>");
    for(var i = 0; i < subjects.length; i++)
    {
        var sub = subjects[i];
        $("#"+sub.id+"group").closest('tr').append("<td id='"+field +"'>"+sub[field]+"</td>");
    }

    //Adding Charts for each Team
    for(var k = 1;k < numTeamGroups;k++)
    {
        drawChart(k,field);
    }
    var globalDiv = document.getElementById('globalChart');
    var gAve = getGlobalAverage(field);
    var gstdDev = globalstdDev(gAve,field);
    globalDiv.innerHTML = 'Global Average = ' + gAve;
    globalDiv.innerHTML = globalDiv.innerHTML + '<br> Global Standard Deviation = ' + gstdDev;
}

function GroupsChanged()
{
    var numGroups = numTeamGroups -1;
    numManipulations += 1;

    if(viewFields[0]) {
        for (var k = 1; k < numTeamGroups; k++) {
            updateChart(k, viewFields[0]);
        }
    }

}
