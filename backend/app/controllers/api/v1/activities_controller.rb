module Api
  module V1
    class ActivitiesController < ApplicationController
      before_action :authenticate_request

      def create
        activity = @current_user.activities.build(activity_params)
        if activity.save
          render json: activity, status: :created
        else
          render json: activity.errors, status: :unprocessable_entity
        end
      end

      private

      def activity_params
        params.require(:activity).permit(:action, :category_id, :minute)
      end
    end
  end
end