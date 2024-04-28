class User < ApplicationRecord
  has_one :user_authentication
  has_many :users_items
  has_many :items, through: :users_items
  has_one :coin, dependent: :destroy
  has_many :avatars
  has_many :user_statuses
  has_many :activities
  has_many :activity_likes
  has_many :liked_activities, through: :activity_likes, source: :activity
  has_many :battle_logs
  has_many :enemies, through: :battle_logs

  after_create :create_default_coin

  def latest_status
    user_statuses.includes(:job).order(created_at: :desc).first
  end

  # 最新のアバターのURLを取得
  def latest_avatar_url
  avatar = avatars.last
  avatar ? avatar.avatar_url : nil
end

  def as_json(options = {})
    super(options.merge(
      methods: [:latest_status, :latest_job, :latest_avatar_url],  # latest_status と latest_job ,latest_avatar_urlの追加
      include: {
        items: { only: [:id, :name, :cost, :item_url, :category] },
        coin: { only: [:amount] },
        avatars: { only: [:id, :avatar_url] },
        activities: {
          include: {
            category: { only: [:id, :name] }  # Activity の Category を含める
          },
          only: [:id, :action, :minute]
        }
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
