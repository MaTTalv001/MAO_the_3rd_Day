class UserStatus < ApplicationRecord
  belongs_to :user
  belongs_to :job  # Jobモデルとの関連付け
end
