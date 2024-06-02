class EnemySerializer < ActiveModel::Serializer
  attributes :id, :name, :enemy_url, :hp, :attack, :defence
end