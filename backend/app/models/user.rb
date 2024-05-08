class User < ApplicationRecord
  has_one :user_authentication, dependent: :destroy
  has_many :users_items, dependent: :destroy
  has_many :items, through: :users_items
  has_one :coin, dependent: :destroy
  has_many :avatars, dependent: :destroy
  has_many :user_statuses, dependent: :destroy
  has_many :activities, dependent: :destroy
  has_many :activity_likes, dependent: :destroy
  has_many :liked_activities, through: :activity_likes, source: :activity, dependent: :destroy
  has_many :battle_logs, dependent: :destroy
  has_many :enemies, through: :battle_logs

  after_create :create_default_coin

  # indexとshowで分岐させて情報量を制御する
  def as_json(options = {})
  if options[:index_view]
    super(options.merge(
      methods: [:latest_avatar_url, :latest_status_as_json, :latest_job],
      include: {
        items: { only: [:id, :name, :cost, :item_url, :category] },
        coin: { only: [:amount] },
        activities: {
          include: {
            category: { only: [:id, :name] }
          },
          only: [:id, :action, :minute]
        }
      }
    ))
  else
    super(options.merge(
      methods: [:latest_status, :latest_job, :latest_avatar_url],
      include: {
        items: { only: [:id, :name, :cost, :item_url, :category] },
        coin: { only: [:amount] },
        avatars: { only: [:id, :avatar_url] },
        activities: {
          include: {
            category: { only: [:id, :name] }
          },
          only: [:id, :action, :minute, :created_at]
        }
      }
    )).tap do |hash|
      hash[:latest_status] = latest_status_as_json
    end
  end
end

def latest_status_as_json
  @latest_status_as_json ||= latest_status&.as_json(include: { job: { only: [:name] } })
end



# 最新のJob名を取得するためのメソッドをUserモデルに追加
def latest_job
  latest_status&.job&.name
end

def latest_status
  user_statuses.includes(:job).order(created_at: :desc).first
end

# 最新のアバターのURLを取得
  def latest_avatar_url
  avatar = avatars.order(created_at: :desc).first
  avatar ? avatar.avatar_url : nil
end


  private

  def create_default_coin
    create_coin(amount: 100)  # Coinの初期値を設定
  end
end
