import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from Dynamodb'
    }
    
    try{
        const id = event.queryStringParameters?.[PRIMARY_KEY];
        if (id){
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME,
                Key: {
                    [PRIMARY_KEY]: id
                }
            }).promise();

            result.body = JSON.stringify(deleteResult);
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