class JwtService
  def self.decode(token)
    hmac_secret = ENV['JWT_SECRET_KEY']
    JWT.decode(token, hmac_secret, true, { algorithm: 'HS256' }).first
  end
end