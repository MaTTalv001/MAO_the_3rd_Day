module Api
  module V1
    class UserStatusesController < ApplicationController
      before_action :authenticate_request

      def create
        user_status = @current_user.user_statuses.build(user_status_params)
        if user_status.save
          render json: user_status, status: :created
        else
          render json: user_status.errors, status: :unprocessable_entity
        end
      end

      private

      def user_status_params
        params.require(:user_status).permit(:user_id, :job_id, :level, :hp, :strength, :intelligence, :wisdom, :dexterity, :charisma)
      end
    end
  end
end