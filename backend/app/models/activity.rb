class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :activity_likes, dependent: :destroy
  has_many :liked_by_users, through: :activity_likes, source: :user
end
