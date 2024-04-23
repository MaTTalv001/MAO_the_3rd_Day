class User < ApplicationRecord
  has_one :user_authentication
  has_many :users_items
  has_many :items, through: :users_items
  has_one :coin, dependent: :destroy
  has_many :avatars
  has_many :user_statuses

  after_create :create_default_coin

  def latest_status
    user_statuses.includes(:job).order(created_at: :desc).first
  end

  def as_json(options = {})
  super(options.merge(
    methods: [:latest_status, :latest_job],  # latest_status と latest_job の追加
    include: {
      items: { only: [:id, :name, :cost, :item_url, :category] },
      coin: { only: [:amount] },
      avatars: { only: [:id, :avatar_url] }
    }
  )).tap do |hash|
    hash[:latest_status] = latest_status.as_json(include: { job: { only: [:name] } })
  end
end

# 最新のJob名を取得するためのメソッドをUserモデルに追加
def latest_job
  latest_status&.job&.name
end

  private

  def create_default_coin
    create_coin(amount: 100)  # Coinの初期値を設定
  end
end
