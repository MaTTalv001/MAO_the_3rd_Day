class AddForeignKeyToUsersActivities < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :activities, :users, column: :user_id, on_delete: :cascade, name: 'fk_activities_users'
  end
end
