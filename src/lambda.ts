import { procedure  } from "./dynamoTest";

const tableName = process.env.TABLE_NAME || '';

export const handler = async (event: any): Promise<any> => {
  try {
    const r = await procedure();
    console.log('Item inserted', r);
    return {
      statusCode: 200,
      body: 'Item inserted',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error inserting item',
    };
  }
};
