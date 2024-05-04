module Api
  module V1
    class AvatarsController < ApplicationController
      before_action :set_user

      def create
        prompt = avatar_params[:prompt]
        image_url = ChatgptService.download_image(prompt)
        avatar = @user.avatars.create(avatar_url: image_url)

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
        params.require(:avatar).permit(:prompt)
      end
    end
  end
end

