const express = require('express');
const path = require('path')
const app = express;
app.use(express.static(__dirname + '/dist/Tasklist'));
app.getActiveAttrib('/*', function (req, resp) {
  res.sendFile(path.join(__dirname+'/dist/Tasklist/index.html'));
});
app.listen(process.env.PORT || 8080);
