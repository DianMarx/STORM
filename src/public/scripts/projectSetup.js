var Subjects; // Object that holds Subject data extracted from CSV
var user; //logged in user
var projectData; // Data related to new project

$(document).ready(function(e) {

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

        $("#CSVInput").onclick = uploadCSV();

        //Submit project details and create new project in database
        $('#AddProjectDetails').on('submit', function(e){
            e.preventDefault();

            projectData = {
                'projectName'  : $("#projectName").val(),
                'subjects' : user.id+"_"+$("#projectName").val()+"_"+"Subjects",
                'admin' : true
            };

            $.ajax({
                type: "POST",
                url: '/projectStore',
                data: projectData,
                success: function (dat, testStatus)
                {
                    if(dat == 0)
                        alert("You already have a project called " + projectData.projectName);
                    else if(dat == 1)
                        alert("Could not save project");
                    else {
                        user.projectID.push(dat);
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
        });
    });
});
//Load page elements and preferences
function init()
{
    $('.loader').html('<img src="images/loader.gif"><br/> Loading Projects...');
    user = JSON.parse(sessionStorage['User']);
    var projectIDs = JSON.stringify(user.projectID);
    $("#righty").text(user.username);

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
        success: function ()
        {
            window.location = "teamsetup" +"?collection="+ projectData.subjects;
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

                var arrayOfTheInput = result.split("\r\n");       //Splits the values from file into array
                var headings = arrayOfTheInput[0].split(",");

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
                        else {
                            tempObj[headings[k]] = line[k];
                        }
                    }
                    JSONObject.push(tempObj);
                }
                Subjects = JSONObject;

            };
        }
    }
}

function ManageProjects(project,dat)
{
    $("#ProjectsTitle").html("<h3 id='ProjectsTitle' class='panel-title pull-left' style='padding-top: 7.5px;'>" + 'Manage ' + project + "</h3><div id='back' class='btn-group pull-right'>"+
                                            "<a href='#' id='loadProjects' class='btn btn-default btn-sm glyphicon glyphicon-menu-left'></a>"+
                                    "</div>");

    $("#loadProjects").click(function (e) {
        LoadProjects(dat);
    });



    $("#MyProjects").html("<div class='btn-group' role='group' aria-label='...'>" +
                            "<a id='openProject' class='btn btn-default' href='/teamSetup?collection="+user.id +'_'+project+'_'+'Subjects'+"'>Open Project</a>"+
                            "<a  class='btn btn-default'>Edit Project</button>"+
                            "<a  class='btn btn-default'>Do Something</a>"+
                            "</div>");


}

function LoadProjects(dat)
{
    $("#ProjectsTitle").html("<h3 id='ProjectsTitle' class='panel-title pull-left' style='padding-top: 7.5px;'>" + 'My Projects');
    var data = JSON.stringify(dat);
    var displayProjects = "";

    //href="/teamSetup?collection='+dat[i].subjects+'" id="'+dat[i].projectName+'"
    for (var i = 0; i < dat.length; i++)
    {
        displayProjects += '<div class="singleProject" data-toggle="tooltip" title="Click to manage project"><a id="'+dat[i].projectName+'" class="projLink" type="submit" href="#">' + dat[i].projectName + '</a></div>';
    }

    $("#MyProjects").html(displayProjects);

    //Open manage projects section
    $(".singleProject").click(function (e) {
        ManageProjects($(this).children("a").attr("id"),dat);
    });
}

