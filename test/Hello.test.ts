import { handler } from "../service/MagnetoTable/Delete";
import { APIGatewayProxyEvent } from "aws-lambda";

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        id: '9c581ec5-769f-4176-951b-a55aba6a07a0'
    }
} as any;


const result = handler(event, {} as any).then((apiResult) => {
    const items = JSON.parse(apiResult.body);
    console.log(123);
});