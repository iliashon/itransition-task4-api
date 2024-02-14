const express = require("express"),
    routes = require("./routes/index"),
    cookieParser = require("cookie-parser"),
    errorMiddleware = require("./middlewares/errorMiddleware"),
    cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    }),
);
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});
app.use(routes);
app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Start server");
});

module.exports = app;
