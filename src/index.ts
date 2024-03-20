import "reflect-metadata"
import app from "./app"
import { scraper } from "./services/scrapingData.service";

const port = 3000;
const server = () =>{
    return app.listen(port);
}
scraper()

const main = async () =>{
    server();
    console.log(`Server is listen on port ${port}`)
}
main();