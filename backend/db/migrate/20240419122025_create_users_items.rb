class CreateUsersItems < ActiveRecord::Migration[7.1]
  def change
    create_table :users_items do |t|
      t.references :user, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.integer :amount

      t.timestamps
    end
  end
end
