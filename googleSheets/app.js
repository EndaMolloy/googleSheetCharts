const express = require('express');

const app = express()

app.use(express.static(__dirname + '/view'))
app.use(express.static(__dirname + '/script'))


app.get('/', function(req, res){
    if(req.session){
        //console.log(req.session);
    }
    console.log('ok');
    res.sendfile('index.html');
});

const port = 3000
app.listen(port,()=>{
  //using es6 template literals
  console.log(`server is listening at ${port}`);
})
