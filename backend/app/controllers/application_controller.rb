class ApplicationController < ActionController::API
  before_action :authenticate_request
  #protect_from_forgery with: :exception
  #skip_before_action :verify_authenticity_token

  protected
  
  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = JwtService.decode(header)
      user_auth = UserAuthentication.find_by(uid: @decoded["google_user_id"])
      @current_user = user_auth.user if user_auth
      Rails.logger.info(@current_user)
      unless @current_user
        # @current_userが見つからない場合のエラー処理
        raise ActiveRecord::RecordNotFound, 'User not found'
      end
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
      Rails.logger.error "Authentication error: #{e.message}"
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end
