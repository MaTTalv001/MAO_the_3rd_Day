class Item < ApplicationRecord
  has_many :users_items
  has_many :users, through: :users_items

  def amount
    users_item = users_items.find_by(user_id: @current_user.id)
    users_item ? users_item.amount : 0
  end
end
