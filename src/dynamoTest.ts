import { DynamoDBClinet } from './client';

const TABLE_NAME = process.env.Todo || `TodoTable`;

async function putItem(client: DynamoDBClinet) {
  const timestamp = new Date().toISOString();
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      id: '1',
      name: timestamp.toString(),
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };
  try {
    const data = await client.docClient.put(params).promise();
    console.log('Item inserted:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error inserting item:', JSON.stringify(err, null, 2));
  }
}

async function getItems(client: DynamoDBClinet): Promise<string> {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: '1',
    },
  };

  try {
    const data = await client.docClient.get(params).promise();
    console.log('Item fetched:', JSON.stringify(data, null, 2));
    return JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('Error fetching item:', JSON.stringify(err, null, 2));
    return JSON.stringify(err, null, 2);
  }
}

export async function procedure(endpointURL: string = '') {
  console.log('table name', TABLE_NAME);
  const clinet = new DynamoDBClinet(endpointURL);
  await putItem(clinet);
  return await getItems(clinet);
}
