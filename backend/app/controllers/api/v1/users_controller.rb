class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show]
  # GET /api/v1/users
  def index
    @users = User.all
    render json: @users.map { |user| user.as_json(index_view: true) } #as_json内分岐で情報量を絞る
  end

  # GET /api/v1/users/:id
  def show
    @user = User.includes(:avatars, :activities, :user_statuses, :items).find(params[:id])
    if @user
      render json: @user
    else
      render json: { error: "User not found" }, status: :not_found
    end
  rescue StandardError => e
    Rails.logger.error("Error in UsersController#show: #{e.message}")
    render json: { error: "Internal Server Error" }, status: :internal_server_error
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
    params.require(:user).permit(:nickname, :name, :email, :password, :password_confirmation)
  end

  def update_params
    params.require(:user).permit(:nickname, :profile)
  end

  
end