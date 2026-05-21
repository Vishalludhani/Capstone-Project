import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import CookieParser from 'cookie-parser'
import { commonRoute } from './APIs/CommonAPI.js'
import cors from 'cors'

config()
const app = exp()

// Configure CORS middleware to dynamically allow requests from the frontend application.
// In production, FRONTEND_URL environment variable is checked.
// In development, it defaults to the local Vite dev server (http://localhost:5173).
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

//add body parser middleware
app.use(exp.json())

app.use(CookieParser())
app.use('/user-api', userRoute)
app.use('/admin-api', adminRoute)
app.use('/author-api', authorRoute)
app.use('/common-api', commonRoute)

const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("DB Connection success")
        // Start HTTP server using configured port or default to 6767
        const port = process.env.PORT || 6767;
        app.listen(port, () => console.log(`Server started on port ${port}`))
    } catch (err) {
        console.log("err in DB connection", err)
    }
}

connectDB()

//deals with invalid routes
app.use((req, res, next) => {
    res.json({ message: `${req.url} is Invalid Route` })
})


//error handling middleware
app.use((err, req, res, next) => {

    console.log("Error name:", err.name);
    console.log("Error code:", err.code);
    console.log("Full error:", err);

    // mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "error occurred",
            error: err.message,
        });
    }

    // mongoose cast error
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "error occurred",
            error: err.message,
        });
    }

    const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

    if (errCode === 11000) {
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];

        return res.status(409).json({
            message: "error occurred",
            error: `${field} "${value}" already exists`,
        });
    }

    if (err.status) {
        return res.status(err.status).json({
            message: "error occurred",
            error: err.message,
        });
    }

    // default server error
    res.status(500).json({
        message: "error occurred",
        error: "Server side error",
    });
});