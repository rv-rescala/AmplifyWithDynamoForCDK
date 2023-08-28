import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration, RemovalPolicy, aws_lambda_nodejs as lambdaNodejs, } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'DynamoLocalTest', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });


    // Lambda Function
    const myLambda = new lambdaNodejs.NodejsFunction(this, 'DynamoLocalTestFunc', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: '../src/lambda.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });


    table.grantReadWriteData(myLambda);
  }
}
