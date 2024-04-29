class AddForeignKeyToUsersAvatars < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :avatars, :users, column: :user_id, on_delete: :cascade, name: 'fk_user_avatars_users'
  end
end
