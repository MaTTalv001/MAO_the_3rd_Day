class ChatgptService
  require 'open-uri'
  require 'fileutils'
  include HTTParty

  base_uri 'https://api.openai.com/v1' # HTTPartyの機能を使ってベースURIを設定
  default_timeout 100

  attr_reader :options, :model, :message

  # クラスの初期化時に一度だけAPIキーを設定
  def initialize(message, model = 'dall-e-3')
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
      messages: [
        {role:'system', content: "あなたは悪の魔王です。魔王に相応しい傲慢な口調と性格をしています。これからプレイヤーと激しいバトルになることでしょう。まずユーザーが日頃の活動についていくつか述べるので、戦闘前に魔王らしくシニカルに讃えてください。内容があまりない場合はそれらに特に触れず無難なセリフで構いません。また、全ての活動に触れる必要もなく、最大2つまででいいです"},
      { role: 'user', content: @message }
    ]
    }.to_json, headers: @options[:headers])

    raise response.parsed_response['error']['message'] unless response.success?
    response.parsed_response['choices'][0]['message']['content']
  end

  # 画像生成機能
  def generate_image_with_dalle2(prompt)
    response = self.class.post('/images/generations', body: {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }.to_json, headers: @options[:headers])

    raise response.parsed_response['error']['message'] unless response.success?
    response.parsed_response['data'][0]['url']
  end

  # 画像をダウンロードしてS3に保存するクラスメソッド
  # DALL-E 2などのAIを利用して画像を生成し、Active Storageで保存するメソッド
  def self.download_image(prompt)
  image_url = new(prompt).generate_image_with_dalle2(prompt)
  timestamp = Time.now.strftime('%Y%m%d_%H%M%S')
  file_name = "#{timestamp}.png"

  file = URI.open(image_url)
  image = MiniMagick::Image.read(file)

  # 画像をリサイズ
  image.resize '256x256' # 適切なサイズに変更

  # 一時ファイルに保存
  temp_file = Tempfile.new(['resized', '.png'])
  image.write temp_file.path

  # Active Storageを使用してS3にファイルをアップロード
  blob = ActiveStorage::Blob.create_and_upload!(
    io: temp_file,
    filename: file_name,
    content_type: 'image/png'
  )

  file.close
  temp_file.close

  # S3のオブジェクトURLを取得
  object_url = "https://#{ENV['AWS_BUCKET']}.s3.#{ENV['AWS_REGION']}.amazonaws.com/#{blob.key}"

  # オブジェクトURLを返す
  object_url
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
    model: "dall-e-3",  # または他のモデル名
    prompt: prompt,
    n: 1,
    size: "1024x1024"
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
