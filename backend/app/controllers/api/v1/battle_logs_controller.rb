module Api
  module V1
    class BattleLogsController < ApplicationController
      before_action :authenticate_request

      def create
        battle_log = BattleLog.new(battle_log_params)
        if battle_log.save
          render json: battle_log, status: :created
        else
          render json: battle_log.errors, status: :unprocessable_entity
        end
      end

      private

      def battle_log_params
        params.require(:battle_log).permit(:user_id, :enemy_id, :result)
      end
    end
  end
end
