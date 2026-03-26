variable "aws_region" {
  description = "Região AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Nome único do bucket S3"
  type        = string
  default     = "csv-uploads-bucket"
}

variable "lambda_function_name" {
  description = "Nome da função Lambda"
  type        = string
  default     = "csv-monitor-lambda"
}
