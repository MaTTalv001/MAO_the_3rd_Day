module Api
  module V1
    class BossBattlesController < ApplicationController
      def create
        @boss = Boss.find(params[:boss_id])
        damage = params[:damage].to_i
        result = params[:result] # 勝ち負けの結果を受け取る

      # 累積ダメージを計算
        total_damage = @boss.total_damage_dealt_by(current_user) + damage
        remaining_hp = @boss.hp - total_damage

        # ボスバトルログの作成
        BossBattleLog.create!(
        user_id: current_user.id,
        boss_id: @boss.id,
        damage_dealt: damage,
        result: result
       )


      render json: { remaining_hp: remaining_hp }
    end
  end
