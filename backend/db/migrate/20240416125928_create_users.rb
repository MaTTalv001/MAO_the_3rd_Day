class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :nickname
      t.text :profile
      t.integer :achievement

      t.timestamps
    end
  end
end
