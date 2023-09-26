import { http } from "@ampt/sdk";

import https  from "https" ;
import { spawn }  from "child_process" ;
import fs  from "fs" ;
import { isNumber, isNullOrUndefined }  from "util";
import { fileURLToPath } from 'url';

const zenno = [
    new Date().toISOString() + " yy " + Math.random(),
    process.cwd(), fileURLToPath(import.meta.url),process.argv[1],"","", "", "",  "", "","", "","", "",
];

function testWrite() {
    const content = "godaa";
    var testPath = "/var/task/zaza.txt";
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

zenno[6] = testWrite();


import express, { Router } from "express";

const app = express();



const api = Router();

api.get("/hello", (req, res) => {

  return res.status(200).send(concatArray());
});
app.use("/api", api);

http.node.use(app);
