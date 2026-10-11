import "dotenv/config";
import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const PORT = config.port

async function main(){
    try {
        await prisma.$connect();
        console.log("connect to The database successfully")
        app.listen(PORT, ()=> {
            console.log(`server is runing on Por ${PORT}`)
        })
    } catch (error) {
        console.error("error statring the server :", error)
        await prisma.$disconnect();
        process.exit(1)
        
        
        
    }
}

main();