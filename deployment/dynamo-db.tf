resource "aws_dynamodb_table" "schedule" {
  name         = "watchl-schedule"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "time"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "time"
    type = "S"
  }
}