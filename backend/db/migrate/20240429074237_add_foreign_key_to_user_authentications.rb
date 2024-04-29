class AddForeignKeyToUserAuthentications < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :user_authentications, :users, column: :user_id, on_delete: :cascade, name: 'fk_user_authentications_users'
  end
end
