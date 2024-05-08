class UserStatus < ApplicationRecord
  belongs_to :user
  belongs_to :job  # Jobモデルとの関連付け
  validates :job_id, :level, :hp, :strength, :intelligence, :wisdom, :dexterity, :charisma, presence: true
  validates :level, :hp, :strength, :intelligence, :wisdom, :dexterity, :charisma, numericality: { greater_than_or_equal_to: 0 }
end
