import { format } from "@formkit/tempo";


export class TempoHandler {


    date_now() {
        return format({
            date: new Date(),
            format: "YYYY-MM-DD HH:mm:ss",
            tz: "America/Caracas",
        })

    }

}