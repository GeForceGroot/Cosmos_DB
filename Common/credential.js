import * as dotenv from 'dotenv';
dotenv.config();


const credentials = {
    cosmos: {
        URL: process.env.URL || "",
        KEY: process.env.KEY || "",
        DATABASE: process.env.DATABASE || ""
    }
}


export default credentials;