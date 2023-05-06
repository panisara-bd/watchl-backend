import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyToken } from '../clients/cognito-verify-client';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const verifyAuth = async (
  event: APIGatewayProxyEvent
): Promise<CognitoAccessTokenPayload> => {
  const authorizationHeader =
    event.headers.authorization || event.headers.Authorization;
  if (!authorizationHeader) {
    console.warn('No authorization header');
    throw new AuthError('No authorization header');
  }

  const token = authorizationHeader.replace('Bearer ', '');
  try {
    const user = await verifyToken(token);
    return user;
  } catch (e) {
    console.warn('Token verification failed', e.message, e.stack);
    throw new AuthError('Token verification failed');
  }
};
