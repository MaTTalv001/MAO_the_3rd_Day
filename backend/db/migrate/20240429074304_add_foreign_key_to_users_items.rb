class AddForeignKeyToUsersItems < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :users_items, :users, column: :user_id, on_delete: :cascade, name: 'fk_user_items_users'
  end
end
