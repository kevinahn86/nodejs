var fs = require('fs');

fs.readdir('./data', function(er,dir){
  console.log(dir);
});
