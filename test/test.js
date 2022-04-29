const multipartParser = require('../dist/index.js')
const fs = require('fs')

const body = fs.readFileSync("./test-input.txt")
const boundary = "AaB03x"
const multiparts = multipartParser.parse(body,boundary);
for(let i=0;i<multiparts.length;i++){
    console.log("multipart ", multiparts[i]);
}