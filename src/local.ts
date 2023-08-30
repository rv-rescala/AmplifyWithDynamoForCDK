import { procedure  } from "./dynamoTest";
import dotenv from 'dotenv';
dotenv.config();

const dynamodbEndpoint = process.env.DYNAMODB_ENDPOINT || '';
console.log(dynamodbEndpoint);
procedure(dynamodbEndpoint);