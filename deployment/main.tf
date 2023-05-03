terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

locals {
  functions = toset(["get-media", "search-media", "schedule-media", "delete-media", "get-schedule", "get-scheduled-media"])
}

data "archive_file" "lambda_archives" {
  for_each    = local.functions
  type        = "zip"
  source_file = "${path.module}/../dist/${each.key}.js"
  output_path = "${path.module}/../dist/${each.key}.zip"
}

resource "aws_lambda_function" "lambdas" {
  for_each         = local.functions
  filename         = data.archive_file.lambda_archives[each.key].output_path
  function_name    = "watchl-${each.key}"
  role             = aws_iam_role.lambda.arn
  handler          = "${each.key}.handler"
  runtime          = "nodejs18.x"
  source_code_hash = data.archive_file.lambda_archives[each.key].output_base64sha256

  environment {
    variables = {
      RAPIDAPI_API_KEY = var.rapidapi_api_key
    }
  }
}

resource "aws_cloudwatch_log_group" "lambdas" {
  for_each          = local.functions
  name              = "/aws/lambda/watchl-${each.key}"
  retention_in_days = 7
}

resource "aws_lambda_permission" "api" {
  for_each      = local.functions
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambdas[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*"
}