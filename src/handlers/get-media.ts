export const handler = async (event: any, context: unknown): Promise<string> => {
  console.log('helloe jepw log', event);
  return 'Helloe jepw';
};
