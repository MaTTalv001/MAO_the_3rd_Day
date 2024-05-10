class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :activity_likes, dependent: :destroy
  has_many :liked_by_users, through: :activity_likes, source: :user

  def likes_count
    activity_likes.count
  end

  def liked_by?(user)
    activity_likes.exists?(user: user)
  end
end
