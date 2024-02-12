const express = require("express"),
    routes = require("./routes/index");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.use(routes);

app.listen(3000, () => {
    console.log("Start server");
});

module.exports = app;
