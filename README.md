# watchl-backend

This is the backend for WatchL. It is using AWS Api Gateway and Lambda, which are deployed with Terraform.

## Tech Stack
- TypeScript
- AWS Lambda
- AWS Api Gateway
- AWS DynamoDB
- AWS Amplify

## Getting Started

### AWS
In order to deploy and start using the backend, make sure you have an AWS account, since this is where the code is going to be deployed. Also, make sure that the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables are set so that Terraform can connect to your AWS account.

### Terraform variables
Next, make sure the required terraform environment variables are configured. One way to do this is through the deployment/terraform.tfvars file:
```
rapidapi_api_key     = "foo"
cognito_user_pool_id = "foo"
cognito_client_id    = "foo"
```

You can obtain a `rapidapi_api_key` by creating an account with https://rapidapi.com. This API is used for fetching information about movies and TV shows.

You can use the authentication part of AWS Amplify to generate a Cognito user pool and client. You can populate these in the `cognito_user_pool_id` and `cognito_client_id` variables. 

### Deploy
To start a deployment, run:
```sh
npm install
npm run build
cd deployment/
terraform init
terraform apply
```