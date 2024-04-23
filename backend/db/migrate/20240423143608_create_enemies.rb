class CreateEnemies < ActiveRecord::Migration[7.1]
  def change
    create_table :enemies do |t|
      t.string :name, null: false
      t.integer :hp, null: false
      t.integer :attack, null: false
      t.integer :defence, null: false
      t.string :enemy_url, null: false

      t.timestamps
    end
  end
end
