
import { initDb } from "./server/db";

initDb().then(() => {
    console.log('init db succes')
}).catch(e => {
    console.log('init db fail ', e)
})