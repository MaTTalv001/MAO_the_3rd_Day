class Boss < ApplicationRecord
  has_many :boss_battle_logs
  has_many :users, through: :battle_logs

  validates :name, presence: true
  validates :hp, numericality: { greater_than_or_equal_to: 0 }
  validates :attack, numericality: { greater_than_or_equal_to: 0 }
  validates :defence, numericality: { greater_than_or_equal_to: 0 }
  validates :boss_url, presence: true 

  def total_damage_dealt_by(user)
    boss_battle_logs.where(user: user).sum(:damage_dealt)
  end

  def current_hp_for(user)
    hp - total_damage_dealt_by(user)
  end

end
