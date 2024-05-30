class BossBattleLogSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :boss_id, :damage_dealt, :result, :created_at, :updated_at
end