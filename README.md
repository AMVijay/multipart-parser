# multipart-parser
Multipart Parser library for Javascript and Typescript projects written in Typescript.

## Implementation Example
Multipart body content will be 
```
--AaB03x
Content-Disposition: form-data; name="submit-name"

Larry
--AaB03x
Content-Disposition: form-data; name="files"; filename="file1.txt"
Content-Type: text/plain

... contents of file1.txt ...
--AaB03x--

```

Implementation in Javascript will be
```
const multipartParser = require('@amvijay/multipart-parser')

const body = "... multipart body buffer"
const boundary = "AaB03x"

const multiparts = multipartParser.parse(body,boundary);
for(let i=0;i<multiparts.length;i++){
    console.log("multipart ", multiparts[i]);
}
```