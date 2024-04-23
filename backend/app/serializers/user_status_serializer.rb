class UserStatusSerializer < ActiveModel::Serializer
  attributes :id, :level, :hp, :strength, :intelligence, :wisdom, :dexterity, :charisma
  belongs_to :job
end
