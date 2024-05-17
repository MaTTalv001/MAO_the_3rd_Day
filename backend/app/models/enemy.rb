class Enemy < ApplicationRecord
  has_many :battle_logs
  has_many :users, through: :battle_logs
  # バリデーション
  validates :name, presence: true
  validates :hp, numericality: { greater_than_or_equal_to: 0 }
  validates :attack, numericality: { greater_than_or_equal_to: 0 }
  validates :defence, numericality: { greater_than_or_equal_to: 0 }
  validates :enemy_url, presence: true 
end
