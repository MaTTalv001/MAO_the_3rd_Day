class User < ApplicationRecord
  has_one :user_authentication
  has_many :users_items
  has_many :items, through: :users_items
  has_one :coin, dependent: :destroy
  has_many :avatars
  has_many :user_statuses

  after_create :create_default_coin

  def latest_status
    user_statuses.order(created_at: :desc).first
  end

  def as_json(options = {})
  super(options.merge(
    methods: [:latest_status, :latest_job],  # latest_jobメソッドを追加
    include: {
      items: { only: [:id, :name, :cost, :item_url, :category] },
      coin: { only: [:amount] },
      avatars: { only: [:id, :avatar_url] },
      user_statuses: {
        include: {
          job: { only: [:name] }  # Jobの名前を含む
        },
        only: [:id, :level, :hp, :strength, :intelligence, :wisdom, :dexterity, :charisma]
      }
    }
  ))
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
