import * as AWS from 'aws-sdk';

// AWS ENV
const isRunningOnLambda = !!process.env.AWS_EXECUTION_ENV;

let dynamoDbConfig = {};

if (isRunningOnLambda) {
  dynamoDbConfig = {
    region: 'us-west-2',
  };
} else {
  dynamoDbConfig = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

AWS.config.update(dynamoDbConfig);

const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDb = new AWS.DynamoDB();

async function createTable() {
  const params = {
    TableName : 'DynamoLocalTest',
    KeySchema: [       
        { AttributeName: 'id', KeyType: 'HASH'},  // Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: 'id', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
  };

  try {
    const data = await dynamoDb.createTable(params).promise();
    console.log("Created table:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Unable to create table:", JSON.stringify(err, null, 2));
  }
}

async function putItem() {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: 'DynamoLocalTest',
    Item: {
      id: 1,
      name: 'John',
    },
  };

  try {
    const data = await docClient.put(params).promise();
    console.log('Item inserted:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error inserting item:', JSON.stringify(err, null, 2));
  }
}

async function getItem(): Promise<string> {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: 'DynamoLocalTest',
    Key: {
      id: 1,
    },
  };

  try {
    const data = await docClient.get(params).promise();
    console.log('Item fetched:', JSON.stringify(data, null, 2));
    return JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('Error fetching item:', JSON.stringify(err, null, 2));
    return JSON.stringify(err, null, 2);
  }
}

export async function procedure() {
  await createTable();
  await putItem();
  return await getItem();
}
