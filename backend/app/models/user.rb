class User < ApplicationRecord
  has_one :user_authentication
  has_many :users_items
  has_many :items, through: :users_items
  has_one :coin, dependent: :destroy
  has_many :avatars

  after_create :create_default_coin

  def as_json(options = {})
    super(options.merge(
      include: { 
        items:{ only: [:id, :name, :cost, :item_url, :category] },
        coin: { only: [:amount] } ,
        avatars: { only: [:id, :avatar_url] }
        }))
  end

  private

  def create_default_coin
    create_coin(amount: 100)  # Coinの初期値を設定
  end
end
