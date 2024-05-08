# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
categories = [
  { name: '運動' },
  { name: '学習' },
  { name: '親交' },
  { name: '仕事' },
  { name: '娯楽' }
]

categories.each do |category|
  Category.create(category)
end