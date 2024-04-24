class ChatgptService
  require 'open-uri'
  require 'fileutils'
  include HTTParty

  base_uri 'https://api.openai.com/v1' # HTTPartyの機能を使ってベースURIを設定
  default_timeout 100

  attr_reader :options, :model, :message

  # クラスの初期化時に一度だけAPIキーを設定
  def initialize(message, model = 'dall-e-2')
    @options = {
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{ENV['CHATGPT_API_KEY']}" # APIキーの使用
      }
    }
    @model = model
    @message = message
  end

  # チャット機能
  def call
    response = self.class.post('/chat/completions', body: {
      model: @model,
      messages: [{ role: 'user', content: @message }]
    }.to_json, headers: @options[:headers])

    raise response.parsed_response['error']['message'] unless response.success?
    response.parsed_response['choices'][0]['message']['content']
  end

  # 画像生成機能
  def generate_image_with_dalle2(prompt)
    response = self.class.post('/images/generations', body: {
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "256x256"
    }.to_json, headers: @options[:headers])

    raise response.parsed_response['error']['message'] unless response.success?
    response.parsed_response['data'][0]['url']
  end

  # 画像をダウンロードするクラスメソッド
  def self.download_image(prompt)
    image_url = new(prompt).generate_image_with_dalle2(prompt)
    timestamp = Time.now.strftime('%Y%m%d_%H%M%S')
    file_name = "#{timestamp}.png"
    file_path = Rails.root.join('public', 'generated_images', file_name)
    FileUtils.mkdir_p(File.dirname(file_path))

    URI.open(image_url) do |image|
      File.open(file_path, 'wb') { |file| file.write(image.read) }
    end

    file_name
  rescue StandardError => e
    Rails.logger.error "Image download failed: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    nil
  end


  # 画像生成
  def self.generate_image_url(prompt)
  options = {
    headers: {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{ENV['CHATGPT_API_KEY']}"
    }
  }

  body = {
    model: "dall-e-2",  # または他のモデル名
    prompt: prompt,
    n: 1,
    size: "256x256"
  }.to_json

  response = post('/images/generations', body: body, headers: options[:headers])
  raise StandardError.new("Error: #{response['error']['message']}") unless response.success?

  response.parsed_response['data'][0]['url']
end

  # クラスメソッドのリファクタリング
  class << self
    def call(message, model = 'gpt-3.5-turbo')
      new(message, model).call
    end
  end
end
