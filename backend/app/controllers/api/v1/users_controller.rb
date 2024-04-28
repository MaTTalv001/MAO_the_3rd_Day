class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show]
  # GET /api/v1/users
  def index
    @users = User.all
    render json: @users    
  end

  # GET /api/v1/users/:id
  def show
  @user = User.find(params[:id])
  if @user
    begin
      avatar_url = @user.latest_avatar_url
      Rails.logger.info("Avatar URL: #{avatar_url}")
      render json: @user.as_json.merge(avatar_url: avatar_url)
    rescue StandardError => e
      Rails.logger.error("Error in UsersController#show: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { error: "Internal Server Error" }, status: :internal_server_error
    end
  else
    render json: { error: "User not found" }, status: :not_found
  end
end

  # PATCH/PUT /api/v1/users/:id
  def update
    @user = User.find(params[:id])
    if @user.update(update_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    head :no_content
  end

  # /api/v1/users/current

  def current
    if @current_user
      render json: { user: @current_user }
    else
      render json: { error: 'Not Authorized' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  
end