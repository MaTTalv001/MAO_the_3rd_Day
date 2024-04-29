class AddOnDeleteCascadeToActivityLikes < ActiveRecord::Migration[6.0]
  def change
    # 外部キー制約を削除
    remove_foreign_key :activity_likes, :activities

    # 外部キー制約を再追加し、on_delete: :cascade オプションを設定
    add_foreign_key :activity_likes, :activities, on_delete: :cascade
  end
end
