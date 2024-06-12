module Api
  module V1
    class BattleLogsController < ApplicationController
      before_action :authenticate_request

      def create
        ActiveRecord::Base.transaction do
          battle_log = BattleLog.new(battle_log_params)
          battle_log.save!

          user = @current_user
          base_amount = params[:base_amount].to_i
          total_amount = user.gain_coins(base_amount)

          render json: {
            battle_log: battle_log,
            user: user.as_json(include: { coin: { only: [:amount] } }),
            gained_coins: total_amount
          }, status: :created
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def battle_log_params
        params.require(:battle_log).permit(:user_id, :enemy_id, :result)
      end
    end
  end
end