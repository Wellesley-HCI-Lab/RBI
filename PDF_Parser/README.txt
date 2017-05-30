pdf Parser
--------------------
Creates json version of a pdf file and extracts all images of the pdf.


Getting Started
--------------------
Requires node.js,npm, and serveral modules to run

To install node and npm, run these commands in the terminal:

	sudo apt-get install nodejs
	sudo apt-get install npm

To install the modules, run these commands in the terminal:

	sudo apt-get install poppler-utils
	npm install querystring
	npm install formidable
	npm install fs
	npm install exec
	npm install sanitize-html
	npm install striptags
	npm install html-to-json
	npm install htmlpraser

Running
--------------------
To run, open a terminal
Change the directory to the directory of these files
Run the command:
	node index.js
Open a browser to localhost:8888
Browse for pdf file to parse
Click upload
Webpage should change to "Process complete" unless there is an error
Terminal will output the results of the process, it may take a few seconds for larger pdf files to process

Directory should now contain:
	the html form of the pdf files (in three different file versions, pdfFile*.html)
	all images in the pdf's (in the format pdfFile*_*.*)
	a data.json file, where all the meta tags of the html file are json objects.

The server should still be running.
To exit, ctrl+c in the terminal
NOTE: Make sure the index.js process is killed before attemping to run 'node index.js' again because it will result in an error. To check if it is still running, run 'jobs' in the terminal. To kill it, type 'fg' and then 'ctrl+c'

To remove the files in the directory to process a new pdf, run these commands in the terminal:
	rm -rf pdfFile*.*
	rm data.json

Files
--------------------
requestHandlers.js is where all the uploading and parsing is done. Open this file if you want to check the logic or console.log additional information.

Don't modify these:
index.js runs the router
router.js routes the requests
sever.js starts the servers


