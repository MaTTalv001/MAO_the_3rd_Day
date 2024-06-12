module Api
  module V1
    class AvatarsController < ApplicationController
      before_action :set_user

      # トランザクションでアイテム消費とアバター生成を同時に行う
      def create
        ActiveRecord::Base.transaction do
          item = Item.find(params[:item_id])
          user_item = @user.users_items.find_by(item_id: item.id)
          if user_item && user_item.amount > 0
            user_item.amount -= 1
            if user_item.amount <= 0
              user_item.destroy
            else
              user_item.save!
            end
          else
            raise ActiveRecord::Rollback, "アイテムが不足しています"
          end

          prompt = avatar_params[:prompt]
          job_id = avatar_params[:job_id]
          image_url = ChatgptService.download_image(prompt)
          avatar = @user.avatars.create(avatar_url: image_url)
          @user.current_avatar_url = image_url
          if @user.save
            user_status = @user.user_statuses.last || @user.user_statuses.new
            user_status.update(job_id: job_id)
            render json: @user.as_json(include: [coin: { only: [:amount] }, items: { only: [:id, :name, :cost, :item_url, :category] }, avatars: { only: [:id, :avatar_url] }]), status: :created
          else
            raise ActiveRecord::Rollback, "アバターの生成に失敗しました"
          end
        end
      rescue ActiveRecord::Rollback => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def set_user
        @user = User.find(params[:user_id])
      end

      def avatar_params
        params.permit(:prompt, :job_id, :item_id, :user_id)
      end
    end
  end
end