class CreateBosses < ActiveRecord::Migration[7.1]
  def change
    create_table :bosses, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci" do |t|
      t.string :name, null: false
      t.integer :hp, null: false
      t.integer :attack, null: false
      t.integer :defence, null: false
      t.string :boss_url, null: false
      t.timestamps
    end
  end
end
