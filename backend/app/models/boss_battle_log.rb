class BossBattleLog < ApplicationRecord
  belongs_to :user
  belongs_to :boss
end

