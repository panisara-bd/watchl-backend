resource "aws_api_gateway_rest_api" "api" {
  body = jsonencode(yamldecode(templatefile("${path.module}/../openapi.yaml.tpl", {
    get_media_lambda_arn : aws_lambda_function.lambdas["get-media"].invoke_arn,
    search_media_lambda_arn : aws_lambda_function.lambdas["search-media"].invoke_arn
  })))

  name = "watchl-api"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "api" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    api_body                = sha1(jsonencode(aws_api_gateway_rest_api.api.body))
    lambda_source_code_hash = join(",", [for lambda in aws_lambda_function.lambdas : lambda.source_code_hash])
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "live" {
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "live"
}

output "api_url" {
  value = aws_api_gateway_stage.live.invoke_url
}