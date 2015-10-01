//Function to Draw the Chart
function drawChart(n,tField) {
    var columnCount = 0;

    var data = new google.visualization.DataTable();;
    var dataArray = [];
    var dataArray1 = [];
    var dataArray2 = [];
    data.addColumn('number', 'values');
    data.addColumn('number', 'values');
    dataArray.push(1);
    dataArray.push(70);
    dataArray1.push(2);
    dataArray1.push(65);
    dataArray2.push(3);
    dataArray2.push(78);
    for(var t=0;t<subjects.length;t++)
    {
        if(subjects[t].group == n)
        {
            columnCount++;
            data.addColumn({id:'i'+t, type:'number', role:'interval'});
        }
    }
//alert(columnCount);
    for(var q = 0;q < subjects.length;q++)
    {
        if(subjects[q].group == n)
        {
            var subje = subjects[q];
            var tempValue = subje[tField];
            dataArray.push(tempValue);
        }
    }
    for(var q = 0;q < subjects.length;q++)
    {
        if(subjects[q].group == n)
        {
            var subje = subjects[q];
            var tempValue = subje[tField];
            dataArray2.push(tempValue);
        }
    }
    for(var q = 0;q < subjects.length;q++)
    {
        if(subjects[q].group == n)
        {
            var subje = subjects[q];
            var tempValue = subje[tField];
            dataArray1.push(tempValue);
        }
    }
    //alert(dataArray);
    data.addRow(dataArray);
    data.addRow(dataArray1);
    data.addRow(dataArray2);
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

/*
function drawExampleChart() {
    var Edata = new google.visualization.DataTable();
    var columnCount;
    Edata.addColumn('number', 'values');
    Edata.addColumn('number', 'values');
        Edata.addColumn({id:'i'+t, type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});
    Edata.addColumn({id:'i', type:'number', role:'interval'});

    Edata.addRows([[1,10,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        [2,21,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40],
        [3,32,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60]]);
}

var EchartOptions = {
    title:'Points, default',
    curveType:'function',
    lineWidth: 2,
    series: [{'color': '#D3362D'}],
    intervals: { 'style':'points', pointSize: 2 },
    legend: 'none';
};
var chart = new google.visualization.LineChart(document.getElementById('exampleChart'));
chart.draw(Edata, EchartOptions);
}*/
