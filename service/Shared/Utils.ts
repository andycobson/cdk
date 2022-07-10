import { APIGatewayProxyEvent } from "aws-lambda";


export function generateRandomId(): string{
    const id: string = Math.random().toString(36).slice(2);
    return id;
}

export function getEventBody(event: APIGatewayProxyEvent){
    return typeof event.body == 'object'? event.body: JSON.parse(event.body);
}