var webApp =
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Web App</title>
  </head>
  <body>
    <label>first name</label>
    <input placeholder="first name" type="text"></input>
    <label>last name</label>
    <input placeholder="last name" type="text"></input>
  </body>
</html>`;


const http = require("http");
const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("My first server!");
};

...

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});