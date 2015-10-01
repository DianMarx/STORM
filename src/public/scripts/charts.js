//Function to Draw the Chart

function drawChart(n,tField) {
    var columnCount = 0;

    var data = new google.visualization.DataTable();

    data.addColumn('number', 'values');
    data.addColumn('number', 'values');

    for(var t=0;t<=subjects.length;t++)
    {
        if(subjects[t].group == n)
        {
            columnCount++;
            data.addColumn({id:'i'+t, type:'number', role:'interval'});
        }
    }
//alert(columnCount);
    //alert(dataArray);
    data.addRow(addData(n,tField));
    data.addRow(addData(n,tField));
    data.addRow(addData(n,tField));
    //alert('test');

    var chartOptions = {
        title:'Points, default',
        curveType:'function',
        lineWidth: 2,
        series: [{'color': '#D3362D'}],
        intervals: { 'style':'points', pointSize: 2 },
        legend: 'none',
    };
    var chart = new google.visualization.LineChart(document.getElementById('chartDiv '+n));
    chart.draw(data, chartOptions);
}

function addData(n,tField){
    var dataArray = new Array();

    dataArray.push(1);
    dataArray.push(70);
    dataArray.push(0);
    for(var q = 0;q < subjects.length;q++)
    {
        if(subjects[q].group == n)
        {
            var subje = subjects[q];
            var tempValue = subje[tField];
            dataArray.push(tempValue);
        }
    }


    return dataArray;
}