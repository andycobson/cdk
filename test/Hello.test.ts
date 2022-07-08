import { handler } from "../service/MagnetoTable/Read";
import { APIGatewayProxyEvent } from "aws-lambda";

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        id: 'b70d4809-3a1c-46fd-a48c-cc3e21631d01'
    }
} as any;


const result = handler(event, {} as any).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(123);
});