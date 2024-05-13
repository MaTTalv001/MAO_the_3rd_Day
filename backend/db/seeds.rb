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

items = [
  { name: "基本職の書", cost: 50, item_url: "imgs/items/item_001.png", category: "アバター生成" },
  { name: "バトルマスターの書", cost: 200, item_url: "imgs/items/item_002.png", category: "アバター生成" },
  { name: "賢者の書", cost: 200, item_url: "imgs/items/item_003.png", category: "アバター生成" },
  { name: "アークプリーストの書", cost: 200, item_url: "imgs/items/item_004.png", category: "アバター生成" },
  { name: "忍者の書", cost: 200, item_url: "imgs/items/item_005.png", category: "アバター生成" },
  { name: "スーパースターの書", cost: 200, item_url: "imgs/items/item_006.png", category: "アバター生成" },
  { name: "勇者の書", cost: 300, item_url: "imgs/items/item_007.png", category: "アバター生成" },
  { name: "回復のポーション", cost: 20, item_url: "imgs/items/item_008.png", category: "道具" },
  { name: "東国の揚げ鶏", cost: 10, item_url: "imgs/items/item_009.png", category: "道具" },
  { name: "毒消しハーブ", cost: 20, item_url: "imgs/items/item_010.png", category: "道具" },
  { name: "棍棒", cost: 30, item_url: "imgs/items/item_011.png", category: "武器" },
  { name: "銅の剣", cost: 50, item_url: "imgs/items/item_012.png", category: "武器" },
  { name: "鉄の槍", cost: 100, item_url: "imgs/items/item_013.png", category: "武器" },
  { name: "魔法の杖", cost: 100, item_url: "imgs/items/item_014.png", category: "武器" },
  { name: "盗賊のナイフ", cost: 100, item_url: "imgs/items/item_015.png", category: "武器" },
  { name: "エルフの弓", cost: 300, item_url: "imgs/items/item_016.png", category: "武器" },
  { name: "ドラゴン殺し", cost: 500, item_url: "imgs/items/item_017.png", category: "武器" },
  { name: "旅人の服", cost: 30, item_url: "imgs/items/item_018.png", category: "防具" },
  { name: "鉄の甲冑", cost: 200, item_url: "imgs/items/item_019.png", category: "防具" },
  { name: "魔導士のローブ", cost: 100, item_url: "imgs/items/item_020.png", category: "防具" },
  { name: "鉄の盾", cost: 100, item_url: "imgs/items/item_021.png", category: "防具" },
  { name: "オーガの大盾", cost: 200, item_url: "imgs/items/item_022.png", category: "防具" },
  { name: "英雄の盾", cost: 500, item_url: "imgs/items/item_023.png", category: "防具" },
  { name: "力の腕輪", cost: 100, item_url: "imgs/items/item_024.png", category: "アクセサリ" },
  { name: "スピードブーツ", cost: 200, item_url: "imgs/items/item_025.png", category: "アクセサリ" },
  { name: "魔法の水晶", cost: 300, item_url: "imgs/items/item_026.png", category: "アクセサリ" },
  { name: "金のブレスレット", cost: 300, item_url: "imgs/items/item_027.png", category: "アクセサリ" },
  { name: "女神のチョーカー", cost: 500, item_url: "imgs/items/item_028.png", category: "アクセサリ" },
  { name: "ルビーの宝玉", cost: 800, item_url: "imgs/items/item_029.png", category: "アクセサリ" },
  { name: "ダイヤの指輪", cost: 1000, item_url: "imgs/items/item_030.png", category: "アクセサリ" },
]

items.each do |item_data|
  item = Item.find_or_initialize_by(id: item_data[:id])
  item.assign_attributes(
    name: item_data[:name],
    cost: item_data[:cost],
    item_url: item_data[:item_url],
    category: item_data[:category],
    created_at: Time.current,
    updated_at: Time.current
  )
  item.save!
end


jobs_data = [
  { name: '冒険者', item_id: 1 },
  { name: '戦士', item_id: 1 },
  { name: '魔法使い', item_id: 1 },
  { name: '僧侶', item_id: 1 },
  { name: '武闘家', item_id: 1 },
  { name: '狩人', item_id: 1 },
  { name: '遊び人', item_id: 1 },
  { name: 'バトルマスター', item_id: 2 },
  { name: '賢者', item_id: 3 },
  { name: 'アークプリースト', item_id: 4 },
  { name: '忍者', item_id: 5 },
  { name: 'スーパースター', item_id: 6 },
  { name: '勇者', item_id: 7 }
]

jobs_data.each do |job|
  Job.find_or_create_by(name: job[:name], item_id: job[:item_id])
end