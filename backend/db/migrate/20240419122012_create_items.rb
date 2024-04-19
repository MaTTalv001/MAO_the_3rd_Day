class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.string :name
      t.integer :cost
      t.string :item_url
      t.string :category

      t.timestamps
    end
  end
end
