class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :activity_likes
  has_many :liked_by_users, through: :activity_likes, source: :user
end
