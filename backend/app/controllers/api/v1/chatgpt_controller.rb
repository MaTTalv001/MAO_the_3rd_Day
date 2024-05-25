module Api
  module V1
    class ChatgptController < ApplicationController
      before_action :authenticate_request

      def call
        user_id = params[:user_id]
        user = User.find(user_id)
        actions = user.activities.order(created_at: :desc).limit(3).pluck(:action)
        message = actions.join(", ")
        Rails.logger.info(message)

        response = ChatgptService.call(message)
        Rails.logger.info(response)
        render json: { response: response }
      end
    end
  end
end