require 'aws-sdk-s3'

class S3Presigner
  def initialize
    @s3_client = Aws::S3::Client.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
    @logger = Rails.logger
  end

  def presigned_url_for(key)
    begin
      bucket = ENV['AWS_BUCKET']
      presigner = Aws::S3::Presigner.new(client: @s3_client)
      presigner.presigned_url(:get_object, bucket: bucket, key: key, expires_in: 3600)
    rescue StandardError => e
      @logger.error("Error in S3Presigner#presigned_url_for: #{e.message}")
      @logger.error(e.backtrace.join("\n"))
      raise
    end
  end
end
