class AddCurrentAvatarUrlToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :current_avatar_url, :string
  end
end
