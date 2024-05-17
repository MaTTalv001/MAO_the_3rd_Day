categories = [
  { name: '運動' },
  { name: '学習' },
  { name: '親交' },
  { name: '仕事' },
  { name: '娯楽' }
]

categories.each do |category|
  Category.find_or_create_by!(category)
end

# アイテムデータを挿入
items = [
  { name: "基本職の書", cost: 50, item_url: "imgs/items/item_001.png", category_name: "アバター生成" },
  { name: "バトルマスターの書", cost: 200, item_url: "imgs/items/item_002.png", category_name: "アバター生成" },
  { name: "賢者の書", cost: 200, item_url: "imgs/items/item_003.png", category_name: "アバター生成" },
  { name: "アークプリーストの書", cost: 200, item_url: "imgs/items/item_004.png", category_name: "アバター生成" },
  { name: "忍者の書", cost: 200, item_url: "imgs/items/item_005.png", category_name: "アバター生成" },
  { name: "スーパースターの書", cost: 200, item_url: "imgs/items/item_006.png", category_name: "アバター生成" },
  { name: "勇者の書", cost: 300, item_url: "imgs/items/item_007.png", category_name: "アバター生成" },
  { name: "回復のポーション", cost: 20, item_url: "imgs/items/item_008.png", category_name: "道具" },
  { name: "東国の揚げ鶏", cost: 10, item_url: "imgs/items/item_009.png", category_name: "道具" },
  { name: "毒消しハーブ", cost: 20, item_url: "imgs/items/item_010.png", category_name: "道具" },
  { name: "棍棒", cost: 30, item_url: "imgs/items/item_011.png", category_name: "武器" },
  { name: "銅の剣", cost: 50, item_url: "imgs/items/item_012.png", category_name: "武器" },
  { name: "鉄の槍", cost: 100, item_url: "imgs/items/item_013.png", category_name: "武器" },
  { name: "魔法の杖", cost: 100, item_url: "imgs/items/item_014.png", category_name: "武器" },
  { name: "盗賊のナイフ", cost: 100, item_url: "imgs/items/item_015.png", category_name: "武器" },
  { name: "エルフの弓", cost: 300, item_url: "imgs/items/item_016.png", category_name: "武器" },
  { name: "ドラゴン殺し", cost: 500, item_url: "imgs/items/item_017.png", category_name: "武器" },
  { name: "旅人の服", cost: 30, item_url: "imgs/items/item_018.png", category_name: "防具" },
  { name: "鉄の甲冑", cost: 200, item_url: "imgs/items/item_019.png", category_name: "防具" },
  { name: "魔導士のローブ", cost: 100, item_url: "imgs/items/item_020.png", category_name: "防具" },
  { name: "鉄の盾", cost: 100, item_url: "imgs/items/item_021.png", category_name: "防具" },
  { name: "オーガの大盾", cost: 200, item_url: "imgs/items/item_022.png", category_name: "防具" },
  { name: "英雄の盾", cost: 500, item_url: "imgs/items/item_023.png", category_name: "防具" },
  { name: "力の腕輪", cost: 100, item_url: "imgs/items/item_024.png", category_name: "アクセサリ" },
  { name: "スピードブーツ", cost: 200, item_url: "imgs/items/item_025.png", category_name: "アクセサリ" },
  { name: "魔法の水晶", cost: 300, item_url: "imgs/items/item_026.png", category_name: "アクセサリ" },
  { name: "金のブレスレット", cost: 300, item_url: "imgs/items/item_027.png", category_name: "アクセサリ" },
  { name: "女神のチョーカー", cost: 500, item_url: "imgs/items/item_028.png", category_name: "アクセサリ" },
  { name: "ルビーの宝玉", cost: 800, item_url: "imgs/items/item_029.png", category_name: "アクセサリ" },
  { name: "ダイヤの指輪", cost: 1000, item_url: "imgs/items/item_030.png", category_name: "アクセサリ" },
]

items.each do |item_data|
  category = Category.find_by(name: item_data.delete(:category_name))
  item = Item.find_or_initialize_by(name: item_data[:name])
  item.assign_attributes(item_data.merge(category: category))
  item.save!
end

# ジョブデータを挿入
jobs_data = [
  { name: '冒険者', item_id: 32 },
  { name: '戦士', item_id: 32 },
  { name: '魔法使い', item_id: 32 },
  { name: '僧侶', item_id: 32 },
  { name: '武闘家', item_id: 32 },
  { name: '狩人', item_id: 32 },
  { name: '遊び人', item_id: 32 },
  { name: 'バトルマスター', item_id: 33 },
  { name: '賢者', item_id: 34 },
  { name: 'アークプリースト', item_id: 35 },
  { name: '忍者', item_id: 36 },
  { name: 'スーパースター', item_id: 37 },
  { name: '勇者', item_id: 38 }
]

jobs_data.each do |job|
  Job.find_or_create_by(name: job[:name], item_id: job[:item_id])
end

# 敵データを挿入
enemies_data = [
  { name: 'ゴブリン', hp: 50, attack: 10, defence: 5, enemy_url: '/imgs/enemies/monster001.png' },
  { name: 'ファントム', hp: 40, attack: 15, defence: 5, enemy_url: '/imgs/enemies/monster002.png' },
  { name: 'ヘドロン', hp: 20, attack: 5, defence: 15, enemy_url: '/imgs/enemies/monster003.png' },
  { name: 'ワイバーンキッズ', hp: 60, attack: 15, defence: 15, enemy_url: '/imgs/enemies/monster004.png' },
]

enemies_data.each do |enemy|
  Enemy.find_or_initialize_by(name: enemy[:name]).tap do |e|
    e.hp = enemy[:hp]
    e.attack = enemy[:attack]
    e.defence = enemy[:defence]
    e.enemy_url = enemy[:enemy_url]
    e.save!
  end
end

# ボスデータを挿入
bosses_data = [
  { name: '魔王', hp: 333, attack: 33, defence: 15, boss_url: '/imgs/boss/boss001.png' },
]

bosses_data.each do |boss|
  boss_record = Boss.find_or_initialize_by(name: boss[:name])
  boss_record.hp = boss[:hp]
  boss_record.attack = boss[:attack]
  boss_record.defence = boss[:defence]
  boss_record.boss_url = boss[:boss_url]
  boss_record.save!
end
