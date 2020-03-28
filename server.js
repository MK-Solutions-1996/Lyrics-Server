const app = require("./app");

app.get("/", (req, res) => {
  res.send("Welcome to the codebright-lyrics-server");
});

const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log("***Server listening at http://%s:%s***", host, port);
});
