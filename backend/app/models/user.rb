class User < ApplicationRecord
  has_one :user_authentication, dependent: :destroy
  has_many :users_items, dependent: :destroy
  has_many :items, through: :users_items do
    def with_amount
      select('items.*, users_items.amount as amount')
    end
  end
  has_one :coin, dependent: :destroy
  has_many :avatars, dependent: :destroy
  has_many :user_statuses, dependent: :destroy
  has_many :activities, dependent: :destroy
  has_many :activity_likes, dependent: :destroy
  has_many :liked_activities, through: :activity_likes, source: :activity, dependent: :destroy
  has_many :battle_logs, dependent: :destroy
  has_many :boss_battle_logs, dependent: :destroy
  has_many :enemies, through: :battle_logs
  has_many :bosses, through: :boss_battle_logs
  scope :without_guest_users, -> { joins(:user_authentication).where.not(user_authentications: { provider: 'guest' }) }

  #levelやhpなどのカラムはuser_statusesテーブルに存在するため、ソートのためのカスタムスコープを作成
  scope :sorted_by, -> (column, direction) {
    case column
    when 'latest_status.level', 'latest_status.hp'
      select("users.*, user_statuses.level AS level, user_statuses.hp AS hp")
      .joins(:user_statuses)
      .where("user_statuses.id = (SELECT us.id FROM user_statuses us WHERE us.user_id = users.id ORDER BY us.created_at DESC LIMIT 1)")
      .order("#{column.split('.').last} #{direction}")
    else
      order("#{column} #{direction}")
    end
  }

  after_create :create_default_coin
  paginates_per 10

  # indexとshowで分岐させて情報量を制御する
  def as_json(options = {})
  if options[:index_view]
    super(options.merge(
      methods: [:latest_avatar_url, :latest_status_as_json, :latest_job],
      include: {
         users_items: { include: { item: { only: [:id, :name, :cost, :item_url, :category] } }, only: [:amount] },
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
         users_items: { include: { item: { only: [:id, :name, :cost, :item_url, :category] } }, only: [:amount] },
        coin: { only: [:amount] },
        avatars: { only: [:id, :avatar_url] },
        activities: {
          include: {
            category: { only: [:id, :name] }
          },
          only: [:id, :action, :minute, :created_at]
        },
        battle_logs: { only: [:id, :enemy_id, :result, :created_at] },
        boss_battle_logs: { only: [:id, :enemy_id, :result, :created_at] }
      }
    )).tap do |hash|
      hash[:latest_status] = latest_status_as_json
    end
  end
end

def latest_status_as_json
  @latest_status_as_json ||= latest_status&.as_json(include: { job: { only: [:name] } })
end

def like_activity(activity)
  activity_likes.create(activity: activity)
end

def unlike_activity(activity)
  activity_likes.find_by(activity: activity).destroy
end

def likes?(activity)
  activity_likes.exists?(activity: activity)
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
    create_coin(amount: 200)  # Coinの初期値を設定
  end
end
