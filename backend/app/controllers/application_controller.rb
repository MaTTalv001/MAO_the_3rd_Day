class ApplicationController < ActionController::API
  before_action :authenticate_request

  protected
  
  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = JwtService.decode(header)
      if @decoded["provider"] == "guest"
        @current_user = User.find(@decoded["user_id"])
      else
        user_auth = UserAuthentication.find_by(uid: @decoded["google_user_id"], provider: @decoded["provider"])
        @current_user = user_auth.user if user_auth
      end
      Rails.logger.info(@current_user)
      unless @current_user
        raise ActiveRecord::RecordNotFound, 'User not found'
      end
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
      Rails.logger.error "Authentication error: #{e.message}"
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end

