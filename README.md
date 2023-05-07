# watchl-backend

This is the backend for WatchL. It is using AWS Api Gateway and Lambda, which are deployed with Terraform.

## Deployment

To start a deployment, run:
```sh
npm install
npm run build
cd deployment/
terraform init
terraform apply
```