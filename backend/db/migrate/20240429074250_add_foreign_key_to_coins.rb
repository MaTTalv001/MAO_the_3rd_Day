class AddForeignKeyToCoins < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :coins, :users, column: :user_id, on_delete: :cascade, name: 'fk_user_coins_users'
  end
end
