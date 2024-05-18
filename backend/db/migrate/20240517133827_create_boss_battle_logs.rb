class CreateBossBattleLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :boss_battle_logs, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci" do |t|
      t.references :user, null: false, foreign_key: true
      t.references :boss, null: false, foreign_key: true
      t.integer :damage_dealt, null: false # ボスに与えたダメージ
      t.boolean :result, null: false
      t.timestamps
    end
  end
end
