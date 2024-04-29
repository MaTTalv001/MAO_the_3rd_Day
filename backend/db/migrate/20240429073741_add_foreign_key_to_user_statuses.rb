class AddForeignKeyToUserStatuses < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :user_statuses, :users, column: :user_id, on_delete: :cascade, name: 'fk_user_statuses_users'
  end
end
