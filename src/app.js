const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();

dotenv.config({ path: "./config/config.env" });
app.use(cors({ credentials: true, origin: process.env.HOST }));
app.use(cookieParser());
const PORT = process.env.PORT;
app.use(express.json());
//Route imports
const user = require('../route/userRoute');
app.use("", user);
dotenv.config({ path: "./config/config.env" });

app.listen(process.env.PORT, () => {
    console.log(`Server is started on port ${PORT}`);
});
