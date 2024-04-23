class Job < ApplicationRecord
  has_many :user_statuses
  belongs_to :item
end
