const express = require('express');
const expressApp = express();
const path = require('path');
const runPath = path.join(__dirname,'..','public'); // go up from server and into public
const port = process.env.PORT || 3000; // this is for heroku to know which port to use

expressApp.use(express.static(runPath));

// responding to GET requests
expressApp.get('*',(request,response)=>{
    //response
    response.sendFile(path.join(runPath,'index.html'));
});

expressApp.listen(port,()=>{
    console.log('Server started!');
})