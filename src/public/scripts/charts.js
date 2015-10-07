//Function to Draw the Chart
var sum;
var average;
var counter;
var dataArray = [];
function drawChart(n,tField) {
    $('#poolChart').append("<div class='charts "+(n)+"'>Team "+(n)+"<div id='chartDiv "+(n)+"'></div> <div id='chartDiv1 "+(n)+"'></div> </div>");
    sum = 0;
    average = 0;
    counter = 0;
    dataArray = [];
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
            dataArray.push(subje[tField]);
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
    alert(stdDev());
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

function stdDev(){
    var variance = 0.0;
    var i = dataArray.length;
    var v1 = 0.0;
    var v2 = 0.0;
    var stddev;
    if ( i != 1)
    {
        for ( var k = 0; k <= i -1; k++)
        {
            v1 = v1 + (dataArray[k] - average) * (dataArray[k] - average);
            v2 = v2 + (dataArray[k] - average);
        }
        v2 = v2 * v2 / i;
        variance = (v1 - v2) / (i-1);
        if (variance < 0) { variance = 0; }
        stddev = Math.sqrt(variance);
    }
    return stddev;
}
function updateChart(n,tField) {
    sum = 0;
    average = 0;
    counter = 0;
    dataArray = [];
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
    var chart = new google.visualization.ScatterChart(document.getElementById('chartDiv1 '+n));
    chart.draw(data, chartOptions);

}