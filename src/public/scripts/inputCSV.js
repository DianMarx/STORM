/**
 * Created by Andreas on 2015/07/08.
 */

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
            //alert(result);
            $("#dialogText").text("Successfully read contents of file.")
            $( "#dialog" ).dialog( "open" );

            var arrayOfTheInput = result.split("\r\n");       //Splits the values from file into array

            /*

                String manipulation kom hier. Die ekstra values (soos punte ens) na 'n "," kom.

             */

            document.getElementById("subjects").innerHTML = "";

            for(i = 0; i < arrayOfTheInput.length-1; i++)
            {
                document.getElementById("subjects").innerHTML += "<div class='subject' id='" + (i+1) + "' draggable='true' ondragstart='drag(event)'>"+ arrayOfTheInput[i] +"<//div>";
            }

            var JSONObject = []; //Hierdie is die JSON object wat in die DB gestoor gaan word.

            for(i = 0; i < arrayOfTheInput.length-1; i++)
            {
                JSONObject.push({
                    "Name" : arrayOfTheInput[i]
                })
            }

            //alert(JSON.stringify(JSONObject));
        };
    }
}