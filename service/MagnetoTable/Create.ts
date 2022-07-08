import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

const { v4: uuidv4 } = require('uuid');

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from Dynamodb'
    }

    const item = typeof event.body == 'object'? event.body: JSON.parse(event.body);
    item.id = uuidv4();

    // const item = {
    //     id: v4()
    // }

    try{
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
    } catch (error) {
        let message;
        if(error instanceof Error) message = error.message;
        else message = String(error)
        result.body = message;
    }

    result.body = JSON.stringify(`Created Item with id: ${item.id}`);

    return result;
}

export { handler }