const express = require("express"),
    routes = require("./routes/index");

const app = express();

app.use(routes);

app.listen(3000, () => {
    console.log("Start server");
});

module.exports = app;
