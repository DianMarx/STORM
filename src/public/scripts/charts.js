//Function to Draw the Chart
var sum;
var average;
var stdDevV;
var counter;
var dataArray = [];

function drawChart(n,tField) {
    $('#poolChart').append("<div class='charts "+(n)+"'><h3>Team"+(n)+"</h3><p><h4> Current manipulation</h4></p> <div id='chartDiv "+(n)+"'></div><p> <h4>Previous manipulation</h4></p> <div id='chartDiv1 "+(n)+"'></div> </div>");
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
    stdDevV = stdDev();
    var chartDiv = document.getElementById('chartDiv '+n);
    chartDiv.innerHTML = chartDiv.innerHTML + 'Average = '+ average + '<br>';
    chartDiv.innerHTML = chartDiv.innerHTML + 'Standard Deviation = '+ stdDevV;


}

function setSum(sValue){
    sum += sValue;
}

function setAverage(aValue){
    average =aValue / counter;
}
function getGlobalAverage(aField){
    var temp = 0;
    for(var q = 0;q < subjects.length;q++)
    {
        var subje = subjects[q];
        var tempValue = subje[aField];
        temp = temp + tempValue;

    }
    temp = temp / subjects.length;
    return temp;
}
function globalstdDev(gAve,gValue){
    var gVariance = 0.0;
    var i = subjects.length;
    var v1 = 0.0;
    var v2 = 0.0;
    var gStddev = 0.0;
    if ( i != 1)
    {
        for ( var k = 0; k <= i -1; k++)
        {
            var subj = subjects[k];
            var tempVal = subj[gValue];
            v1 = v1 + (tempVal - gAve) * (tempVal - gAve);
            v2 = v2 + (tempVal - gAve);
        }
        v2 = v2 * v2 / i;
        gVariance = (v1 - v2) / (i-1);
        if (gVariance < 0) { gVariance = 0; }
        gStddev = Math.sqrt(gVariance);
    }
    return gStddev;
}

function stdDev(){
    var variance = 0.0;
    var i = dataArray.length;
    var v1 = 0.0;
    var v2 = 0.0;
    var stddev = 0.0;
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
    copyDiv(n);
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
    stdDevV = stdDev();
    var chartDiv = document.getElementById('chartDiv '+n);
    chartDiv.innerHTML = chartDiv.innerHTML + 'Average = '+ average + '<br>';
    chartDiv.innerHTML = chartDiv.innerHTML + 'Standard Deviation = '+ stdDevV;
}

function copyDiv(n) {
    var firstGraph = document.getElementById('chartDiv '+n);
    var secondGraph = document.getElementById('chartDiv1 '+n);
    secondGraph.innerHTML = firstGraph.innerHTML;
}