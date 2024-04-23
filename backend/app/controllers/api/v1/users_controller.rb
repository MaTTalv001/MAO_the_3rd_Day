class Api::V1::UsersController < ApplicationController
  # GET /api/v1/users
  def index
    
  end

  # GET /api/v1/users/:id
  def show
    @user = User.find(params[:id])
    render json: @user, serializer: CustomUserSerializer
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