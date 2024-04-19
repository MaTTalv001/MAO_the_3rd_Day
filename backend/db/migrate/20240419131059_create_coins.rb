class CreateCoins < ActiveRecord::Migration[7.1]
  def change
    create_table :coins do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :amount, default: 0

      t.timestamps
    end
  end
end
