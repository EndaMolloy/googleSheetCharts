google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);



function drawChart(){
  const datatable =[];
  const url ='https://spreadsheets.google.com/feeds/list/1vViRdDBdkz8nOnsvE5rOPoYiQC8LQscaY5LSq7Jjr3M/od6/public/basic?alt=json';

$.getJSON(url,(data)=>{

  const sheetArr = []
  $.each(data.feed.entry,(i,val)=>{
    var content = val.content.$t

    rowToObj(content)
  })

    const labels = []


    //Get the graph series from the object keys
    //json data in the format
    //[{"key1":  val1},{"key2": val2}]
    for(let i =0; i<sheetArr.length; i++){
      Object.keys(sheetArr[i]).forEach(key=>{
        //console.log(key);
           if(labels.indexOf(key)=== -1)
             labels.push(key)
      });
    }
    datatable.push(labels)


    //put the values to be graphed into an array ready to be sent to webpage
    for(let i=0; i< sheetArr.length; i++){
      const arr = Object.keys(sheetArr[i]).map(key=> {
        return sheetArr[i][key];
      });
        while(arr.length < labels.length){
          arr.push(0);
        }
      datatable.push(arr)
    }

    console.log(datatable)

  //get the sum of hours for the week
    //First flatten the datatable array
    //then remove all string values
    //then sum remaining numbers
//     const sumHrsWeek = datatable.reduce((a,b)=>{return a.concat(b)})
//                                 .filter(val =>{
//                                   if(typeof val !== 'string')
//                                     return val;
//                                 })
//                                 .reduce((a,b)=>{
//                                   return a+b;
//                                 })


    function rowToObj(row){
      //console.log(row)
      let kvpArr = rowToKvp(row)
      let kvpObj = arrToObj(kvpArr)
      sheetArr.push(kvpObj)

    }

    function arrToObj(arr){
      //console.log(arr)

      let obj = arr.reduce((o, currArr)=> {
        let key = currArr[0], value = currArr[1]
        o[key] = value
        return o
      },{})
      return obj
    }

    function rowToKvp(row){
      let result = []
      let columns = row.split(', ');

      $.each(columns, function(i) {
          let kvp = columns[i].split(': ');
          //if number parse 2 number
          let value = kvp.pop();
          if(!(value.includes("/") || /^[a-zA-Z]+$/.test(value))){
            value = parseFloat(value);
          }
            kvp.push(value);
            result[i] = kvp;
      });
      return result;
    }



    var data = google.visualization.arrayToDataTable(datatable);
    var options = {
      legend: {position: "bottom"},
      chartArea: {
         top: 28,
         height: '50%'
      },
      title:"Enda Coffee",
      vAxis: {title: "Hours"}, isStacked: true,
      hAxis: {title: "Week",
              direction: -1,
              slantedText: true,
              // slantedTextAngle: 90,
              viewWindowMode: 'pretty'}
    }

  //   // Create and draw the visualization.
  let chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'))
  chart.draw(data, options);
  }) //end of getJSON

  //if I put it here no access to datatable
}


$(window).resize(function(){
  drawChart();
});
