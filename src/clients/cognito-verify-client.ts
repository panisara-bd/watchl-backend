import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: 'eu-west-1_tunW9EPFz',
  tokenUse: 'access',
  clientId: '3q3mcbqe3kqijhv760m27cvsfe',
});

export const verifyToken = async (token: string) => {
  try {
    return await verifier.verify(token)
  } catch (e) {
    console.error(e);
    return null
  }
};
