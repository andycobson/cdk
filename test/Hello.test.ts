import { handler } from "../service/MagnetoTable/Create";

const event = {
    body: {
        location: 'Paris'
    }
}


handler(event as any, {} as any);