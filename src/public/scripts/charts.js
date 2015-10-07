//Function to Draw the Chart
var sum;
var average;
var counter;
function drawChart(n,tField) {
    $('#poolChart').append("<div class='charts "+(n)+"'>Team "+(n)+"<div id='chartDiv "+(n)+"'</div> </div>");
    sum = 0;
    average = 0;
    counter = 0;
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Subject');
    data.addColumn('number', 'Marks');

    for(var q = 0;q < subjects.length;q++)
    {
        if(subjects[q].group == n)
        {
            var subje = subjects[q];
            var tempValue = subje[tField];
            data.addRow([++counter,tempValue]);
            setSum(subje[tField]);
        }
    }
    setAverage(sum);
    var chartOptions = {
        title: 'Subjects vs '+tField+' comparison',
        hAxis: {title: 'Subject', minValue: 0, maxValue: 15},
        vAxis: {title: tField, minValue: 0, maxValue: 100},
        legend: 'none'
    };
    var chart = new google.visualization.ScatterChart(document.getElementById('chartDiv '+n));
    chart.draw(data, chartOptions);

}

function setSum(sValue){
    sum += sValue;
}

function setAverage(aValue){
    average =sum / counter;
}

function getAverage(){
    return average;
}
