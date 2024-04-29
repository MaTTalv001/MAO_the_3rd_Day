class ChangeAvatarUrlToText < ActiveRecord::Migration[6.0]
  def change
    change_column :avatars, :avatar_url, :text
  end
end
