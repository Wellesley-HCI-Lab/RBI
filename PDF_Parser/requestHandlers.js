//all the required modules to run the code
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
require('shelljs/global');
var sanitizeHtml = require('sanitize-html');
var striptags = require('striptags');
var htmlToJson = require('html-to-json');
var htmlparser = require("htmlparser");

//request handler for creating the upload form
function start(response) {
    console.log("Request handler 'start' was called.");
    var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Upload file" />'+
	'</form>'+
	'</body>'+
	'</html>';
		//writing the response to the page
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}
//request handler for uploading. This is where the pdf processing occurs
function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    //parsing the pdf
    form.parse(request, function(error, fields, files) {
	console.log("parsing done");
	//renaming pdf that was uploaded to test.pdf
	fs.rename(files.upload.path, "/tmp/test.pdf",function(error) {
	    if (error) {	
		fs.unlink("/tmp/test.pdf");
		fs.rename(files.upload.path, "/tmp/test.pdf");
		console.log(error);
	    }
	    console.log("about to exec");
	    //executing pdftohtml to create html files, can be run in the terminal too
	    exec("pdftohtml /tmp/test.pdf pdfFile.html").output; 
	    
	    //reads in one version of the resulting file
	    var file = fs.readFileSync("pdfFiles.html", "utf8");
	    
	    //print out file
	    //console.log(file);
	    
	    console.log('DONE LOGGING FILE');
	    
	    //gets the unprettified version of the html file
	    var dirty = striptags(file, '<b>');
	    
	    //cleans up pdf
	    var newFile = sanitizeHtml(dirty);
	    
	    //print out pretty file
	    console.log(newFile);
	    
	    //request handler for making file into a json
	    //move to it's own function maybe?
	    var handler = new htmlparser.DefaultHandler(function (error, dom) {
		if (error){
			//print out error
		    console.log(error);
		}
		else {
			//write the dom into a new json file
		  //console.log(dom);
		    var wstream = fs.createWriteStream('data.json');
		    wstream.write(JSON.stringify(dom));
		    wstream.end();
		}

	    });
	    //run the parser asynchroniously
	    var parser = new htmlparser.Parser(handler);
	    var jsonFile = parser.parseComplete(newFile);
	    //console.log(jsonFile);
	    
		//to delete the files that are created automatically when it is run
		//exec('rm -rf pdfFile*.*');
		//process.exit();
		//exec('rm data.json')
	});
	//changes page once the pdf is uploaded
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Process complete:<br/>");
	response.end();
    });
}
//not used
function show(response) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "application/pdf"});
}
//export modules to the main file
exports.start = start;
exports.upload = upload;
exports.show = show;
