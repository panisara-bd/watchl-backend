import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.AWS_CLIENT_ID,
});

export const verifyToken = async (token: string) => {
  try {
    return await verifier.verify(token)
  } catch (e) {
    console.error(e);
    return null
  }
};
