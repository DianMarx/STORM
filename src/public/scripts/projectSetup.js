var Subjects; // Object that holds Subject data extracted from CSV
var user; //logged in user

$(document).ready(function(e) {

    if (sessionStorage.length == 0) // no user logged on.
    {
        alert("Please log in");
        window.location.href = "/";

        $("#errorDialog").html("You are not logged in. <br> Please go back and log in or sign up. ");
        $("#errorDialog").dialog({
            resizable: false,
            modal: true,
            title: "Error",
            height: 250,
            width: 400,
            buttons: {
                "Ok": function () {
                    $(this).dialog('close');
                    //return to login
                }
            }
        });
    }
    else //user is logged on.
    {

        $('.loader').html('<img src="images/loader.gif"><br/> Loading Projects...');
        user = JSON.parse(sessionStorage['User']);
        var projectIDs = JSON.stringify(user.projectID);
        $("#user").text("User: " + user.username);

        //send project ids to server and get projects related to a user
        if (user.projectID.length === 0) {
            $("#Projects").html("You do not have any active projects.<br><br>Click the button below to start a new project.");
        }
        else if (user.projectID.length > 0) {
            $.ajax({
                type: "POST",
                url: '/projectSetup',
                data: {"ids": projectIDs},
                dataType: "json",
                success: function (dat, testStatus) {

                    var data = JSON.stringify(dat);
                    var displayProjects = "";

                    for (var i = 0; i < dat.length; i++) {
                        displayProjects += '<div><a class="projLink" type="submit" href="/teamSetup?collection='+dat[i].projectName+'" id="'+dat[i].projectName+'">' + dat[i].projectName + '</a></div><br/>';
                    }
                    $("#Projects").html(displayProjects);

                    $(".projLink").click(function (e) {
                        //$.get("/teamSetup",{collection:$(this).attr('id')});
                        window.location.href="/teamSetup";
                    });

                },
                error: function (e) {
                    console.log(e);
                }
            });
        }

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
        'Project Name: <br/><input type="text" id="projectName"><br/><br/>' +
        'Import subjects from .CSV file: <br/><input type="file" id="CSVInput" name="file" accept=".csv"/>' +
        '<input type="submit" value="Submit"/>' +
        '</form>' +
        '</div>');
        $( "input[type=submit], button, input[type=file]" ).button();

        $("#CSVInput").onclick = uploadCSV();

        //Submit project details and create new project in database
        $('#AddProjectDetails').on('submit', function(e){
            e.preventDefault();

            var projectData = {
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
                    user.projectID.push(dat);
                    var userData =
                    {
                        'userID':user.id,
                        'projectIDs': user.projectID
                    };

                    //Update user to reflect new project created by him
                    $.ajax({
                        type: "POST",
                        url: '/update',
                        data: {data: JSON.stringify(user), collection: 'Users', id: user.id},
                        success: function (dat, testStatus)
                        {

                            alert(JSON.stringify(Subjects));
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                },
                error: function (e) {
                    console.log(e);
                }
            });

            /*$.ajax({
                type: "POST",
                url: '/subjectsStore',
                data: "subjectsName="+$("#projectName").val() + "_" + "Subjects"+"&subjects="+JSON.stringify(Subjects),
                success: function (dat, testStatus) {


                },
                error: function (e) {
                    console.log(e);
                }
            });*/
        });
    });




});

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
                //$("#dialog-confirm").html("Successfully read the contents of the file.");

                /*Define the Dialog and its properties.
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
                });*/

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
                        else
                            tempObj[headings[k]] = line[k];
                    }
                    JSONObject.push(tempObj);
                }
                Subjects = JSONObject;

            };
        }
    }
}


