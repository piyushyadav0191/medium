import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";


const dbURL = process.env.DATABASE_URL as string

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL).then((data: any) => {
            console.log(`Database connected with ${data.connection.host}`)
        })
    } catch (error: any) {
        console.log(error.message)
        setTimeout(connectDB, 5000)
    }
}

export default connectDB