class SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create]

  def create
    frontend_url = ENV['REACT_APP_API_URL']
    user_info = request.env['omniauth.auth']
    google_user_id = user_info['uid']
    provider = user_info['provider']
    token = generate_token_with_google_user_id(google_user_id, provider)

    user_authentication = UserAuthentication.find_by(uid: google_user_id, provider: provider)

    if user_authentication
      Rails.logger.info("アプリユーザー登録されている")
      redirect_to "#{frontend_url}/MyPage?token=#{token}", allow_other_host: true
    else
      Rails.logger.info("まだアプリユーザー登録されていない")
      # 仮のユーザーを作成
      user = User.create(nickname: "新規ユーザー", achievement: 0)
      # UserStatusを作成し、ユーザーに関連付け
      status = user.user_statuses.create(user_id: user.id, job_id: 1, level: 1, hp: 100, strength: 1, intelligence: 1, wisdom: 1, dexterity: 1, charisma: 1)
      avatar = user.avatars.create(user_id: user.id, avatar_url: "/default/default_player.png")
      item = user.users_items.create(user_id: user.id, item_id: 1, amount: 3)
      UserAuthentication.create(user_id: user.id, uid: google_user_id, provider: provider)
      redirect_to "#{frontend_url}/MyPage?token=#{token}", allow_other_host: true
    end
  end

  private

  def generate_token_with_google_user_id(google_user_id, provider)
    exp = Time.now.to_i + 24 * 3600
    payload = { google_user_id: google_user_id, provider: provider, exp: exp }
    hmac_secret = ENV['JWT_SECRET_KEY']
    JWT.encode(payload, hmac_secret, 'HS256')
  end
end
