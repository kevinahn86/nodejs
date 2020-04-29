var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'ahn',
  password:'dkswlxkr',
  database:'ahn'
});
db.connect();

var app = http.createServer(function(request,response){

    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){

      if(queryData.id === undefined){

        db.query(`select * from member`,function(err, result){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(result);
          var html = template.html(title,list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>`)
          response.writeHead(200);
          response.end(html);
        });

      }else{

        // fs.readdir('./data', function(err,filelist){
        //   var list = template.list(filelist);
        //   var title = queryData.id;
        //   var filteredID = path.parse(queryData.id).base;

        // fs.readFile(`data/${filteredID}`, 'utf8', function(err,description){
        //   var html= template.html(title,list,
        //     `<h2>${title}</h2>${description}`
        //   ,`<a href="/create">create</a>
        //   <a href="/update?id=${title}">update</a>
        //   <form action="delete_process"
        //         method="post">
        //     <input type="hidden" name="id" value="${title}">
        //     <input type="submit" value="delete">
        //   </form>
        //   `);
        //   response.writeHead(200);
        //   response.end(html);
        // });

        // });
      }

    }else if(pathname=== '/create'){

      fs.readdir('./data', function(err,filelist){
        var title = queryData.id;
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html= template.html(title,list,
          `<form action="http://localhost:3000/create_process"
                method="post">
            <p><input type="text" name="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`, `create`);
        response.writeHead(200);
        response.end(html);
      });

    }else if(pathname==='/create_process'){

      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });

    }else if(pathname==='/update'){

      fs.readdir('./data', function(err,filelist){
        var list = template.list(filelist);
        var title = queryData.id;
        var filteredID = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredID}`, 'utf8', function(err,description){
          var html= template.html(title,list,
            `<form action="http://localhost:3000/update_process"
                  method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`, `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="delete_process"
                  method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>`);
          response.writeHead(200);
          response.end(html);
        });
      });

    }else if(pathname ==='/update_process'){

      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        var filteredID = path.parse(id).base;
          fs.rename(`data/${filteredID}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            });
          });
      });

    }else if(pathname ==='/delete_process'){

      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredID = path.parse(id).base;
        fs.unlink(`data/${filteredID}`, function(err){``
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });

    }

    else{
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);
