class CreateJobs < ActiveRecord::Migration[7.0]
  def change
    create_table :jobs do |t|
      t.string :name
      t.references :item, null: false, foreign_key: true  # item_idとしてreferencesを使用

      t.timestamps
    end
  end
end
