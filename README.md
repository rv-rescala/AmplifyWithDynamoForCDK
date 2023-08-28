
# How to use local DynamoDB

## Launch local DynamoDB

```bash
docker pull amazon/dynamodb-local
docker run -d -p 8000:8000 amazon/dynamodb-local
```

## Install dependencies

```bash
npm install aws-sdk typescript ts-node
```

## Edit typescript code

Please edit dynamoLocalEx.ts

## Run typescript code

```bash
ts-node src/local.ts
```