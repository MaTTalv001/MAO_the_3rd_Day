class CreateUserStatuses < ActiveRecord::Migration[7.1]
  def change
    create_table :user_statuses do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :job_id, null: false
      t.integer :level, null: false
      t.integer :hp, null: false
      t.integer :strength, null: false
      t.integer :intelligence, null: false
      t.integer :wisdom, null: false
      t.integer :dexterity, null: false
      t.integer :charisma, null: false

      t.timestamps
    end
  end
end
