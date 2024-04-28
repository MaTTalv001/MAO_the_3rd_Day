require 'aws-sdk-s3'

Aws.config.update({
  region: ENV['AWS_REGION'], # 適切なリージョンに設定
  credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
})

