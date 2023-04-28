import { Context } from 'aws-lambda';

export const handler = async (event: any, context: Context): Promise<any> => {
  console.log('helloe jepw log', event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: '123',
      title: 'hellow jepw',
    }),
  }
};
