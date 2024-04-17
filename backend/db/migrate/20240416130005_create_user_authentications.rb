class CreateUserAuthentications < ActiveRecord::Migration[7.1]
  def change
    create_table :user_authentications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false
      t.string :uid, null: false
      t.text :tokens

      t.timestamps
    end
  end
end
