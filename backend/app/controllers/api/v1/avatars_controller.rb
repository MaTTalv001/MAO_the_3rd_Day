module Api
  module V1
    class AvatarsController < ApplicationController
      before_action :set_user

      def create
        prompt = avatar_params[:prompt]
        job_id = avatar_params[:job_id]
        image_url = ChatgptService.download_image(prompt)
        avatar = @user.avatars.create(avatar_url: image_url)

        # userの直近のステータスのジョブを変更する
        user_status = @user.user_statuses.last || @user.user_statuses.new
        user_status.update(job_id: job_id)

        if avatar.persisted?
          render json: avatar, status: :created
        else
          render json: avatar.errors, status: :unprocessable_entity
        end
      end


      private

      def set_user
        @user = User.find(params[:user_id])
      end

      def avatar_params
        params.permit(:prompt, :job_id)
      end
    end
  end
end

