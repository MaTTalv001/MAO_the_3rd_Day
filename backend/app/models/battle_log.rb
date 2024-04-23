class BattleLog < ApplicationRecord
  belongs_to :user
  belongs_to :enemy
end
