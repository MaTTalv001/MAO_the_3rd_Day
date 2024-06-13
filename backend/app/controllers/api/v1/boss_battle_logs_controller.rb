module Api
  module V1
class BossBattleLogsController < ApplicationController
  before_action :authenticate_request

  def index
    user = User.find(params[:user_id])
    boss = Boss.find(params[:boss_id])
    logs = BossBattleLog.where(user: user, boss: boss)
    render json: logs, each_serializer: BossBattleLogSerializer
  end

  def create
    ActiveRecord::Base.transaction do
      user = @current_user
      boss = Boss.find(params[:boss_id])
      damage = params[:damage_dealt].to_i
      result = params[:result]
      base_amount = params[:base_amount].to_i

      # 累計ダメージを計算
      total_damage = BossBattleLog.where(user: user, boss: boss).sum(:damage_dealt) + damage
      remaining_hp = boss.hp - total_damage

      BossBattleLog.create!(
        user_id: user.id,
        boss_id: boss.id,
        damage_dealt: damage,
        result: result
        )
        
        gained_coins = user.gain_coins(base_amount)
        # if result && remaining_hp <= 0
        # #   BossBattleLog.where(user: user, boss: boss).delete_all # 討伐成功時に累積ダメージをリセット
        # # end
        user.special_mode_unlocked = false
        user.save!
        
        render json: {
          remaining_hp: remaining_hp,
          result: result,
          user: user.as_json(include: { coin: { only: [:amount] } }),
          gained_coins: gained_coins
        }
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end
end
end
