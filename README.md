
# How to use local DynamoDB

## Install dependencies

```bash
npm install aws-sdk typescript ts-node
```

## Edit typescript code

Please edit dynamoLocalEx.ts

## Run mock server

```bash
amplify mock api
```

## Run typescript code

```bash
ts-node src/local.ts
```

## Export

```bash
amplify export --out cdk/lib/  --allow-destructive-graphql-schema-updates -y
```

## Deploy

```bash
cdk deploy --all
```