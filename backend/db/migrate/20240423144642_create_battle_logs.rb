class CreateBattleLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :battle_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :enemy, null: false, foreign_key: true
      t.boolean :result, null: false

      t.timestamps
    end
  end
end
