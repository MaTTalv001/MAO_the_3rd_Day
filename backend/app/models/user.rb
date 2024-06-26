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
  # ゲストログインを省くスコープ prividerがguestのユーザー以外を返す
  scope :without_guest_users, -> { joins(:user_authentication).where.not(user_authentications: { provider: 'guest' }) }

  # levelやhpなどのカラムはuser_statusesテーブルに存在するため、ソートのためのカスタムスコープを作成。
  # カラムと昇降順方向（asc, desc）を引数としてuser.sorted_byという使い方ができる
  # ソートするカラムがlatest_status.levelまたはlatest_status.hpの場合
  # usersテーブルとuser_statusesテーブルを結合し、最新のstatusを取得する
  # サブクエリを使用して、各ユーザーの最新のuser_statusを取得しlevelまたはhpでソートする
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
  # kaminariを使ったページネーションでデフォルトのアイテム数
  paginates_per 12

  # indexとshowで分岐させて情報量を制御する
  def as_json(options = {})
  Rails.logger.debug "as_json called with options: #{options.inspect}"
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
      Rails.logger.debug "as_json result: #{hash.inspect}"
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

#コイン獲得のクラスメソッド
def gain_coins(base_amount)
    charisma_bonus = latest_status.charisma * 0.01
    total_amount = (base_amount * (1 + charisma_bonus)).floor

    logger.info "Base amount: #{base_amount}"
    logger.info "Charisma bonus: #{charisma_bonus}"
    logger.info "Total amount: #{total_amount}"

    coin.amount += total_amount

    if coin.save
      total_amount
    else
      raise ActiveRecord::RecordInvalid, coin.errors.full_messages.join(', ')
    end
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
