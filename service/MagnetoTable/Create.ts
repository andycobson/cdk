import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { MissingFieldError, validateAsAxiomEntry  } from '../Shared/InputValidator';
import { generateRandomId, getEventBody } from '../Shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from Dynamodb'
    }

    try{
        const item = getEventBody(event);
        item.id = generateRandomId();
        validateAsAxiomEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();
        result.body = JSON.stringify(`Created Item with id: ${item.id}`);
    } catch (error) {
        let message;
        if (error instanceof MissingFieldError) result.statusCode = 403;
        if(error instanceof Error) message = error.message;
        else message = String(error)
        
        result.body = message;
    }

    return result;
}

export { handler }