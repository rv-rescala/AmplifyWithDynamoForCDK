import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration, RemovalPolicy, aws_lambda_nodejs as lambdaNodejs, aws_iam as iam, aws_lambda as lambda } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { AmplifyExportedBackend } from '@aws-amplify/cdk-exported-backend';
import * as path from 'path';
import { parse } from 'graphql';
import * as fs from 'fs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*
    const table = new dynamodb.Table(this, 'DynamoLocalTest', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    */

    const appName = 'AmplifyWithDynamoFor'
    const amplifyCDKName = `amplify-export-${appName}`
    const amplifyStack = new AmplifyExportedBackend(this, `${appName}AmplifyStack`, {
      path: path.resolve(__dirname, '..', `./lib/${amplifyCDKName}`),
      amplifyEnvironment: 'dev'
    });

    const dynamoDbReadWritePolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:PutItem',
            'dynamodb:GetItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            'dynamodb:Query',
            'dynamodb:Scan',
          ],
          Resource: ['arn:aws:dynamodb:*:*:table/*'],
        },
      ],
    };

    const dynamoDbReadWritePolicy = new iam.ManagedPolicy(this, `${appName}DynamoAC`, {
      document: iam.PolicyDocument.fromJson(dynamoDbReadWritePolicyDocument),
    });

    const lambdaExecutionRole = new iam.Role(this, `${appName}LambdaFnExecRole`, {
      roleName: `${appName}_lambda_fn-exec-role`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName(`service-role/AWSLambdaVPCAccessExecutionRole`), // for rds
        dynamoDbReadWritePolicy, // for dynamodb
      ]
    });

    // Lambda Function
    const graphqlPath = `./amplify/backend/api/${appName.toLowerCase()}/schema.graphql`;
    const schema = fs.readFileSync(graphqlPath, 'utf8');
    const ast = parse(schema);
    const typeNames = ast.definitions
      .filter(def => def.kind === 'ObjectTypeDefinition')
      .map(def => (def as any).name.value);
    
      const tableNames = typeNames.map(typeName => 
        ({ [typeName] : amplifyStack.graphqlNestedStacks().modelNestedStack(typeName).includedTemplate.getResource(`${typeName}Table`).ref })
      );
      const mergedTableNames = Object.assign({}, ...tableNames);
      console.log(mergedTableNames);

    const myLambda = new lambdaNodejs.NodejsFunction(this, `${appName}Func`, {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: './src/lambda.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64,
      role: lambdaExecutionRole,
      environment: {
        ...mergedTableNames,
        "ABC": "123"
      }
    });
  }
}
