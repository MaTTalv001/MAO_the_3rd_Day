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
    user = @current_user
    boss = Boss.find(params[:boss_id])
    damage = params[:damage_dealt].to_i
    result = params[:result]

    # 累計ダメージを計算
    total_damage = BossBattleLog.where(user: user, boss: boss).sum(:damage_dealt) + damage
    remaining_hp = boss.hp - total_damage

    BossBattleLog.create!(
      user_id: user.id,
      boss_id: boss.id,
      damage_dealt: damage,
      result: result
    )

    # if result && remaining_hp <= 0
    #   user.coin.amount += 300
    #   BossBattleLog.where(user: user, boss: boss).delete_all # 討伐成功時に累積ダメージをリセット
    # elsif result
    #   user.coin.amount += [10, 20, 30].sample
    # end

    # user.coin.save!

    render json: { remaining_hp: remaining_hp, result: result }
  end
end
end
end
