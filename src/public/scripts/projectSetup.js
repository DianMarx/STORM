var Subjects; // Object that holds Subject data extracted from CSV
var fields;
var user; //logged in user
var projectData; // Data related to new project

$(document).ready(function(e) {

    $("#logOutBtn").click(function(){
        if (confirm('Are you sure you want to logout?'))
            location.href = "/";
    });

    //Tooltip for elements
    $('[data-toggle="tooltip"]').tooltip();

    //Check login status
    if (sessionStorage.length == 0) // no user logged on.
    {
        alert("Please log in");
        window.location.href = "/";
    }
    else //user is logged on.
    {
        init();
    }

    //Animation for Add project image
    $("#AddProjectsImg").hover(
        function(){$(this).animate({width: 150, height:150}, 500);},
        function(){$(this).animate({width: 100, height:100}, 300);}
    );

    //Add form to enter project details
    $("#AddProjectsImg").click(function(){
        $("#AddProjects").html( '<div id="AddProjectDetails">' +
                                    '<form id="addProjForm">' +
                                        '<div class="form-group">Project Name: <br/><input class="form-control" type="text" id="projectName" required></div>' +
                                        '<div class="form-group">Import subjects from .CSV file: <br/><input class="form-control" type="file" id="CSVInput" name="file" accept=".csv" required/></div>' +
                                        '<input class="btn btn-default" type="submit" value="Submit"/>' +
                                    '</form>' +
                                '</div>');

        $("#CSVInput").on('click',function(e){
            uploadCSV();
        });

        //Submit project details and create new project in database
        $('#AddProjectDetails').on('submit', function(e){
            e.preventDefault();

            if($("#projectName").val().indexOf("$") > -1)
            {
                alert("Your project name cannot contain the $ character");
            }
            else
            {
                projectData = {
                    'projectName'  : $("#projectName").val(),
                    'subjects' : user.id+"_"+$("#projectName").val()+"_"+"Subjects",
                    'admin' : true
                };
                if(correctFormat()) {
                    $.ajax({
                        type: "POST",
                        url: '/projectStore',
                        data: projectData,
                        success: function (dat, testStatus) {
                            if (dat == 0)
                                alert("You already have a project called " + projectData.projectName);
                            else if (dat == 1)
                                alert("Could not save project");
                            else {
                                user.projectID.push(dat);
                                sessionStorage['User'] = JSON.stringify(user); //add new project to user session storage


                                var userData =
                                {
                                    'userID': user.id,
                                    'projectIDs': user.projectID
                                };

                                //Update user to reflect new project created by him
                                $.ajax({
                                    type: "POST",
                                    url: '/projToUser',
                                    data: {projectID: dat, id: user.id},
                                    success: function () {
                                        subjToDB(projectData.subjects);
                                    },
                                    error: function (e) {
                                        console.log(e);
                                    }
                                });
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }
                else
                    clearInput();
            }
        });
    });
});
//Load page elements and preferences
function init()
{
    $('.loader').html('<img src="images/loader.gif"><br/> Loading Projects...');
    user = JSON.parse(sessionStorage['User']);
    var projectIDs = JSON.stringify(user.projectID);

    $("#usernm").html(user.username);

    //send project ids to server and get projects related to a user

    if (user.projectID == undefined || user.projectID.length == 0 ) {
        $("#MyProjects").html("You do not have any active projects.<br><br>Click the button below to start a new project.");
    }
    else if (user.projectID.length > 0) {
        $.ajax({
            type: "POST",
            url: '/projectSetup',
            data: {"ids": projectIDs},
            dataType: "json",
            success: function (dat, testStatus) {

                LoadProjects(dat);

            },
            error: function (e) {
                console.log(e);
            }
        });
    }
}

//subjects Array to db
function subjToDB(colName)
{
    $.ajax({
        type: "POST",
        url: '/subjToDB',
        data: {data: JSON.stringify(Subjects), collection: colName},
        success: function () {
            window.location = "teamsetup" + "?collection=" + projectData.subjects;
        },
        error: function (e) {
            console.log(e);
        }
    });
}
//Function to convert CSV file to JSON object
function uploadCSV()
{
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
                result = result.replace(/\r?\n|\r/g, "\r\n");
                result = result.replace(/\;/g, ",");

                var obj = $.csv.toObjects(result);
                var arr = $.csv.toArrays(result);
                fields = arr[0];

                fields.forEach(function(field){
                    if(field.indexOf(" ") > -1)
                    {
                        var temp = field;
                        field = field.replace(/\ /g, "_");
                        for(i = 0; i<obj.length; i++)
                        {
                            obj[i][field] = obj[i][temp];
                            delete obj[i][temp];
                        }
                    }
                });

                Subjects = obj;
                var id = 0;
                Subjects.forEach(function(sub){ // add ID field
                    sub.id = id;
                    id++;
                });

                //console.log(JSON.stringify(Subjects));
                //console.log(JSON.stringify(fields));
            };
        }
    }
}

/*function ManageProjects(project,dat)
{
    $("#ProjectsTitle").html(   "<h3 id='ProjectsTitle' class='panel-title pull-left' style='padding-top: 7.5px;padding-bottom: 7.5px'>" + 'Manage ' + project + "</h3>"+
                                "<div id='back' class='btn-group pull-right' data-toggle='tooltip' title='Back to My Projects'>"+
                                    "<a href='#' id='loadProjects' class='btn btn-default btn-sm glyphicon glyphicon-menu-left'></a>"+
                                "</div>");

    //reload projects when back button pressed
    $("#loadProjects").click(function (e) {
        LoadProjects(dat);
    });


    //add buttons to manage projects
    $("#MyProjects").html("<div class='btn-group' role='group' aria-label='...'>" +
                            "<a id='openProject' class='btn btn-default' href='/teamSetup?collection="+user.id +'_'+project+'_'+'Subjects'+"'>Open Project</a>"+
                            "<button id='editProject'  class='btn btn-default'>Edit Project</button>"+
                            "</div>");

    //change project name and subjects collection associated to it

    $("#editProject").click(function(e){
        $("#MyProjects").html('<div class="form-group">Project Name: <br/><input class="form-control" type="text" id="editProjectName" value="'+project+'" required></div>' +
        '<button id="change" class="btn btn-default">Change</button>' +
        '</form>' +
        '</div>');
    });



}*/


function LoadProjects(dat)
{
    //$("#ProjectsTitle").html("<h3 id='ProjectsTitle' class='panel-title pull-left' style='padding-top: 7.5px; padding-bottom: 7.5px'>" + 'My Projects');
    var data = JSON.stringify(dat);
    var displayProjects = "";

    //href="/teamSetup?collection='+dat[i].subjects+'" id="'+dat[i].projectName+'"
    for (var i = 0; i < dat.length; i++)
    {
        displayProjects += '<div class="singleProject" data-toggle="tooltip" title="Click to open project"><a href="/teamSetup?collection='+dat[i].subjects+'" id="'+dat[i].projectName+'" class="projLink '+i+'" type="submit">' + dat[i].projectName + '</a><div hidden class="pull-right"><span class="glyphicon glyphicon-trash delProj" data-toggle="tooltip" title="Click to delete project"></span></div></div>';
    };

    //show hide delete glyph
    $(document).on("mouseenter", ".singleProject", function() {
        $(this).find("div").show();
    });
    $(document).on("mouseleave", ".singleProject", function() {
        $(this).find("div").hide();
    });

    //change delete glyph color on hover
    $(document).on("mouseenter", ".delProj", function() {
        $(this).css("color","red");
    });
    $(document).on("mouseleave", ".delProj", function() {
        $(this).css("color","black");
    });

    // add delete click event handler
    $(document).on("click", ".delProj", function() {
        var p = $(this).parent().parent().find(".projLink").attr("id");
        var _id = $(this).parent().parent().find(".projLink").attr("class").split(' ')[1];
        deleteProject(p,_id);

    });

    $("#MyProjects").html(displayProjects);

    //Open manage projects section
/*    $(".singleProject").click(function (e) {
        ManageProjects($(this).children("a").attr("id"),dat);
    });*/
}

//cascading delete
//deletes project from db
//deletes subject collection associated
//deletes users reference to project
function deleteProject(p,id)
{
    var subj = user.id + "_"+p+"_"+"Subjects";
    var uid = user.id;
    var pid = user.projectID[id];

    if (confirm('Are you sure you want to delete ' + p)) {
        $.ajax({
            type: "POST",
            url: '/deleteProject',
            data: {subjects: subj, UID: uid, PID: pid},
            success: function (dat) {
                alert(dat);
                user.projectID.splice(id, 1);
                sessionStorage['User'] = JSON.stringify(user);
                init();
            },
            error: function (e) {
                console.log(e);
            }
        });
    }
}
 function correctFormat()
 {
     var validNumSubs;
     var duplicates = false;
     var counter = {};
     var nulls = false;
     var FirstColID = true;
     var errorSub;
     var emptyCol = false;

     if(fields.indexOf("id") > -1)
     {
         alert("The file cannot contain a column called id");
         return false;
     }

     fields.unshift("id");
     var name = fields[1];

     for(i =0; i < fields.length; i++)
     {
         if(fields[i] === "")
         {
             emptyCol = true;
             break;
         }

     }

     for(k = 0; k < Subjects.length; k++)
     {
         for(i = 0; i < fields.length; i++)
         {
             if(Subjects[k][fields[i]] === "")
             {
                 nulls = true;
                 errorSub = Subjects[k][name];
                 break;
             }
         }
         if(nulls)
            break;
     }


     if($.isEmptyObject(Subjects))
     {
         alert("The file cannot be empty. See user manual for correct upload formats.");
         return false;
     }
     if(emptyCol)
     {
         alert("The file cannot have an empty column header.");
         return false;
     }
     else if(Subjects.length < 2 || fields.length < 2)
     {
         alert("A minimum of 1 column and 2 subjects are required. See user manual for correct upload formats.");
         return false;
     }
     else if(nulls)
     {
         alert("Subjects cannot have empty values. The first error occurred at subject: " + errorSub);
         return false;
     }
     else if(fields[1] != 'Name' && fields[1] != 'name')
     {
         alert("Column 1 must contain name values. See user manual for correct upload formats.");
         return false;
     }
     return true;
 }

function clearInput()
{
    var control = $("#CSVInput");
    control.replaceWith( control = control.clone( true ) );
}