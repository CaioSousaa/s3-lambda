output "bucket_name" {
  value = aws_s3_bucket.csv_uploads.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.csv_uploads.arn
}

output "lambda_function_arn" {
  value = aws_lambda_function.csv_monitor.arn
}
