class RegistrationsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create, :update]

  def update
    user = User.find(params[:id])
    if user.update(user_params)
      Rails.logger.info("User情報の更新成功")
      render json: { success: true, user: user.as_json }, status: :ok
    else
      Rails.logger.error("Userの更新に失敗: #{user.errors.full_messages.join(", ")}")
      render json: { errors: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:nickname, :profile, :achievement)
  end
end
