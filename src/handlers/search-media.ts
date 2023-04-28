export const handler = async (): Promise<any> => {
  console.log('helloe jepw search log');
  return {
    statusCode: 200,
    body: JSON.stringify([
      {
        id: '123',
        title: 'search jepw',
      },
    ]),
  };
};
