var numTeamGroups = 1; //Including add div, so technically numTeamGroups-1 drop able groups.
var testUser = false;
var user;
var collection = getParameterByName('collection');
var subjects;

$(document).ready(function(e) {

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

    //gets all the subjects' fields
    var fields = [];
    for (var name in subjects[0]) {

        if (name[0] != '_') {
            name = name.replace(' ', '_');
            fields.push(name);
            //$('<th>' + name + '</th>').appendTo("#subjectFields");
        }
    }
    populateTable();

    //toSubjects table
    function populateTable() {
        $(function() {


            $("#subjTable").jsGrid({
                height: "500px",
                width: "100%",

                selecting: true,
                sorting: true,
                paging: true,
                autoload: true,
                inserting: true,

                pageSize: 15,
                pageButtonCount: 5,
                rowClick: function(a){ },
                deleteConfirm: "Do you really want to delete the client?",
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


    $(".table").selectable();
    //Loads subject pool with first variable(name)
    function populateSubjectPool()
    {
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
            }
        });
        $("#subjects").droppable({
            accept: '.subject',
            drop: function(event, ui) {
                //var temp = alert();
                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
            }
        });

    }


    //User selectable fields to view
    function addField(field)
    {
        field = field.replace(' ','_');
        $(".subjHeader").append("<th id='" +field+"'>"+ field + "</th>");
        for(var i = 0; i < subjects.length; i++)
        {
            var sub = subjects[i];
            $("#"+sub.id+"group").closest('tr').append("<td id='"+field +"'>"+sub[field]+"</td>");
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
        if (fields[i][0] != '_' /*&& fields[i] != 'previousGroups'*/) {

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

function updateTeams()
{

}


    $('#randomize').click(function(e) {
        randomize($('.names').children().length,numTeamGroups-1);
    });
//Shuffling Algorithm---------------------------------------------------------------------------------------------------------------
    $('#shuffle').click(function(e) {
        //var parameter = $(".shuffleBy:checked").val();
        //alert(parameter);
        //shuffle($('.names').find('.subjBody').children().length,numTeamGroups-1,subjects);

        var algs = [];
        var i = 0;
        $('.algPart').each(function(){
            var alg = new Object();
            alg.field = $(this).find('#selectField option:selected').val();
            alg.type = $(this).find('#shuffleSelect option:selected').val();
            if(alg.type == 'By Roles'){
                alert($(this).find('.strict').first().checked);
                //alert(alg.strict);
            }
            alg.weight = parseInt($(this).find('#weight').val());
            algs.push(alg);
        });

        goShuffle(subjects,algs,numTeamGroups-1);
    });

    $("#plusButton").click(function(e){

            var temp = '<table class="table" ><thead><tr class="subjHeader"><th>Name</th></tr></thead><tbody  class="subjBody" id="'+numTeamGroups+'"></tbody></table>';
            $("<div class='teamTables "+(numTeamGroups)+"''><img src='images/minus_button.png' class='minusButton mB"+(numTeamGroups)+"' alt='minus' height='25' width='25'><img src='images/left_arrow.png' class='leftArrow lA"+(numTeamGroups)+"' alt='move back height='25' width='25'>"+temp+"</div>").insertBefore($("#teamAdd"));
            numTeamGroups++;
            $("#totalTeams").val(numTeamGroups-1);



        $(".teamTables").droppable({
            accept: '.subject',
            cursor: "normal",
            drop: function(event, ui) {
                //var temp = alert();
                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this).find('.subjBody'));
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

    var k = {};


    addAlgorithmBox();
    $('#addAlg').click(function (e) {
       addAlgorithmBox();
    });
    //nog klaar maak
    $("#maxPerGroup").change(function(e){

        var groups = parseInt(Math.ceil(subjects.length/$(this).val()));
        $("#totalTeams").val(groups);
    });

    function addAlgorithmBox()
    {
        //appendTO
        var div = "<div class='algPart'><button type='button' class='close' id='closeAlg'><span aria-hidden='true'>x</span> </button> Select Field: <select name='selectField' class='form-control' id='selectField'>"
        for(var i = 0; i < fields.length; i++)
        {
         div+= "<option value = '" + fields[i] + "'>"  + fields[i] + "</option>";
        }
        div += "</select>";
        div += "<br>Select Shuffle type: <select name='selectType' class='form-control' id='shuffleSelect'><option value='Similar'>Similar</option><option value='Diverse'>Diverse</option></select>";
        div += "<br><div class='rules'></div><br>Weight: <input type='number' class='form-control' min=1 value=1 id='weight'/></div>";
        $("#shuffleRow").prepend(div);

        //$('#closeAlg').unbind();
        $('#closeAlg').click(function(e){
           $(this).parent().detach();
        });


    }
    $("#exportMasterTable").click(function (e) {
       exportCSV(subjects, fields);
    });
    $("#exportGroups").click(function (e) {

        for(var i = 0; i < subjects.length; i++) {

            subjects[i].group = $('tr[id=' + subjects[i].id+']').parent('tbody').attr('id');

        }
        fields.push("group");
        exportCSV(subjects, fields);
        for(var p = 0; p < subjects.length; p++) {

            delete subjects[p].group;

        }
        fields.pop();

    });
    $("#saveIteration").click(function (e) {

        for(var i = 0; i < subjects.length; i++) {

            subjects[i].previousGroups.push($('tr[id=' + subjects[i].id+']').parent('tbody').attr('id'));

        }


        updateSubjects(subjects);
    });
    $("#returnSubjs").click(function(e){
        $(".subject").detach().appendTo("#subjects table .subjBody");
    });

    $("#selectField").change(function(){
var field = $(this).val();

       if(isDiscrete(field,subjects[0]))
        {

            $(this).parent().find("#byRoles").detach();
            $(this).parent().find("#shuffleSelect").append("<option id='byRoles' value='By Roles'>By Roles</option>");

        }else {
           $(this).parent().find("#byRoles").detach();
           $(this).parent().find('.roles').detach();
       }
    });

    $("#shuffleSelect").change(function(){

        $(this).parent().find('.roles').detach();
        if($(this).val() == "By Roles")
        {
            var t = $(this).parent().find(".rules");
            var div = $("<div class='roles'><h6>Roles per grouping</h6></div>").appendTo(t);
            var field = $(this).parent().find("#selectField").val();

            var arr = getDiscreteArr(field, subjects);
            var spinner = $("<input class='input-group' style='width:40px; float: right;' id='roleCount' type='number' value='1' min='1'>").appendTo(div);

            var select = $("<select></select>").addClass('aRole').appendTo(div);
            $(arr).each(function(){
                select.append($("<option>").attr('value',this).text(this));
            });
            var numRoles = 1;
            $(div).prepend("<h6>strict: <input type='checkbox' class='strict' name='strict' value='strict'></h6>");
            $(spinner).change(function () {


                while(numRoles < $(this).val()){
                    select = $("<select></select>").addClass('aRole').appendTo(div);
                    $(arr).each(function(){
                        select.append($("<option>").attr('value',this).text(this));
                    });
                    numRoles++;
                }
                while(numRoles > $(this).val()) {
                $(this).parent().find('.aRole').first().detach();
                numRoles--;
                }
            });

        }

    });

    $("#saveMasterToDB").click(function(e){
            updateSubjects(subjects);
        }
    );

    $("#plusButton").click();
    $("#plusButton").click();
    populateSubjectPool();


});

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

    for(var i = 0; i < fields.length; i++) {
        if (fields[i] != 'previousGroups') {

        csvContent += fields[i];
        if (i != fields.length - 2)
            csvContent += ',';
    }
    }
    csvContent += '\r\n';
    for(var p = 0; p < subs.length; p++)
    {
        for(var k = 0; k < fields.length; k++)
        {   if(fields[k] != "previousGroups") {
            csvContent += subs[p][fields[k]];
            if (k != fields.length - 2)
                csvContent += ',';
        }
        }
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
    var field;
    field.type = "control";
    newFields.push(field);

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

            //console.log(JSON.stringify(obj));
            MergeSubjects(obj,arr[0]);
        };
    }
}

function MergeSubjects(newSubjects,Criteria)
{
    var validNumSubs;
    var duplicates = false;
    var validCSV = true;
    var newCriteria = false;
    var moreSubs = false;
    var temp = subjects;
    var sameIDs = false;
    var numFieldsNew = Criteria.length;
    var counter = {};

    newSubjects.forEach(function(sub){ //count duplicates
       var key = JSON.stringify(sub['id']);
        counter[key] = (counter[key] || 0) + 1;
        if(counter[key] > 1)
            duplicates = true;
    });

    for(i = 0; i < temp.length; i++)
    {
        delete temp[i]["previousGroups"];
        delete temp[i]["__v"];
        delete temp[i]["group"];
    }
    var fields = Object.getOwnPropertyNames(temp[0]);

    for(i = 0; i < newSubjects.length; i++)
    {
        if(Object.keys(newSubjects[i]).length != numFieldsNew) { // check if subjects have same number of attributes
            validCSV = false;
        }
        else //check for null values
        {

            for(k = 0; k < numFieldsNew; k++)
            {
                if(newSubjects[i][Criteria[k]] == "")
                {
                    validCSV = false;
                }
            }
        }
    }
    for(k = 0; k < temp.length; k++) // check if all subject ids are present
    {
        for(i = 0; i < newSubjects.length; i++)
        {
            validNumSubs = false;
            if(temp[k]['id'] == newSubjects[i]['id']) //NB CHANGE TO FIRST CRITERIA NOT HARDCODED id
            {
                validNumSubs = true;
                break;
            }
        }
        if(!validNumSubs)
            break;
    }
    if(!validCSV)
    {
        alert("The file you uploaded is not in the correct format. See user manual for correct upload formats");
    }
    else if(!validNumSubs)
    {
        alert("Some subjects have been omitted. See user manual for correct upload formats");
    }
    else if(duplicates)
    {
        alert("You cannot have duplicate unique identifiers. See user manual for correct upload formats");
    }
    else
    {
        if(newSubjects.length > temp.length) // User attempting to add new subject
        {
            moreSubs = true;
        }

        for(i = 0; i < Criteria.length; i++)
        {
            if(fields.indexOf(Criteria[i]) == -1) // User wants to add new criteria
            {
                newCriteria = true;
            }
        }

        if(newCriteria)
        {
            for(k = 0; k < temp.length; k++) // for each object in temp merge with object in newSubject where ids are the same
            {
                for(i = 0; i < newSubjects.length; i++)
                {
                    validNumSubs = false;
                    if(temp[k]['id'] == newSubjects[i]['id']) //NB CHANGE TO FIRST CRITERIA NOT HARDCODED id
                    {
                        $.extend(temp[k],newSubjects[i]);
                        //console.log(JSON.stringify(temp[k]));
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
            for(k = 0; k < newSubjects.length; k++) // for each object in newSubjects not matching any subjects in temp, push to temp.
            {
                for(i = 0; i < temp.length; i++)
                {
                    validNumSubs = false;
                    if(temp[i]['id'] == newSubjects[k]['id']) //NB CHANGE TO FIRST CRITERIA NOT HARDCODED id
                    {
                        validNumSubs = true;
                        break;
                    }
                }
                if(!validNumSubs)
                    temp.push(newSubjects[k]);
            }
        }
        //console.log(JSON.stringify(temp));
    }
}


function SortBy(arr,key)
{
    arr.sort(function(a, b){
        var keyA = a.key,
            keyB = b.key;
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
}

