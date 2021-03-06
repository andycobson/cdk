import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getEventBody } from '../Shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from Dynamodb'
    }

    try{ 
        const requestBody = getEventBody(event);
        const id = event.queryStringParameters?.[PRIMARY_KEY];

        if (requestBody && id) {
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];

            const updateResult = await dbClient.update({
                TableName: TABLE_NAME,
                Key:{
                    [PRIMARY_KEY]: id
                },
                UpdateExpression: 'set #zzzNew = :new',
                ExpressionAttributeNames: {
                    '#zzzNew': requestBodyKey
                },
                ExpressionAttributeValues:{
                    ':new': requestBodyValue
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();

            result.body = JSON.stringify(updateResult);
        }
    } catch(error){
        let message;
        if(error instanceof Error) message = error.message;
        else message = String(error)
        result.body = message;
    }

    return result;
}

export { handler }