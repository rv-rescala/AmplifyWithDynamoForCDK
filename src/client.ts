import * as AWS from 'aws-sdk';

export class DynamoDBClinet {
  readonly docClient: AWS.DynamoDB.DocumentClient;
  readonly db: AWS.DynamoDB;

  constructor(endpointURL: string) {
    const isRunningOnLambda = !!process.env.AWS_EXECUTION_ENV;
    let dynamoDbConfig = {};
    if (isRunningOnLambda) {
      dynamoDbConfig = {
        region: 'ap-northeast-1'
      };
    } else {
      dynamoDbConfig = {
        endpoint: endpointURL,
        region: 'us-fake-1',
        accessKeyId: 'fake',
        secretAccessKey: 'fake'
      };
    }
    console.log(dynamoDbConfig);
    AWS.config.update(dynamoDbConfig);
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.db = new AWS.DynamoDB();
  }
}
