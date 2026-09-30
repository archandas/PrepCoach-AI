import 'dotenv/config';

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT;

app.listen(Number(PORT), "0.0.0.0",() => {
    console.log(`server is running on port ${PORT}`);
})

 connectDB();
