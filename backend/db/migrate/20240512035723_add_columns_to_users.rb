class AddColumnsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :consecutive_days, :integer, default: 0
    add_column :users, :special_mode_unlocked, :boolean, default: false
    add_column :users, :last_special_unlocked_date, :date
  end
end
