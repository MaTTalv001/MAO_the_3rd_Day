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
  { id: 1, name: "基本職の書", cost: 50, item_url: "imgs/items/item_001.png", category: "アバター生成" },
  { id: 2, name: "バトルマスターの書", cost: 200, item_url: "imgs/items/item_002.png", category: "アバター生成" },
  { id: 3, name: "賢者の書", cost: 200, item_url: "imgs/items/item_003.png", category: "アバター生成" },
  { id: 4, name: "アークプリーストの書", cost: 200, item_url: "imgs/items/item_004.png", category: "アバター生成" },
  { id: 5, name: "忍者の書", cost: 200, item_url: "imgs/items/item_005.png", category: "アバター生成" },
  { id: 6, name: "スーパースターの書", cost: 200, item_url: "imgs/items/item_006.png", category: "アバター生成" },
  { id: 7, name: "勇者の書", cost: 300, item_url: "imgs/items/item_007.png", category: "アバター生成" },
  { id: 8, name: "回復のポーション", cost: 20, item_url: "imgs/items/item_008.png", category: "道具" },
  { id: 9, name: "東国の揚げ鶏", cost: 10, item_url: "imgs/items/item_009.png", category: "道具" },
  { id: 10, name: "毒消しハーブ", cost: 20, item_url: "imgs/items/item_010.png", category: "道具" },
  { id: 11, name: "棍棒", cost: 30, item_url: "imgs/items/item_011.png", category: "武器" },
  { id: 12, name: "銅の剣", cost: 50, item_url: "imgs/items/item_012.png", category: "武器" },
  { id: 13, name: "鉄の槍", cost: 100, item_url: "imgs/items/item_013.png", category: "武器" },
  { id: 14, name: "魔法の杖", cost: 100, item_url: "imgs/items/item_014.png", category: "武器" },
  { id: 15, name: "盗賊のナイフ", cost: 100, item_url: "imgs/items/item_015.png", category: "武器" },
  { id: 16, name: "エルフの弓", cost: 300, item_url: "imgs/items/item_016.png", category: "武器" },
  { id: 17, name: "ドラゴン殺し", cost: 500, item_url: "imgs/items/item_017.png", category: "武器" },
  { id: 18, name: "旅人の服", cost: 30, item_url: "imgs/items/item_018.png", category: "防具" },
  { id: 19, name: "鉄の甲冑", cost: 200, item_url: "imgs/items/item_019.png", category: "防具" },
  { id: 20, name: "魔導士のローブ", cost: 100, item_url: "imgs/items/item_020.png", category: "防具" },
  { id: 21, name: "鉄の盾", cost: 100, item_url: "imgs/items/item_021.png", category: "防具" },
  { id: 22, name: "オーガの大盾", cost: 200, item_url: "imgs/items/item_022.png", category: "防具" },
  { id: 23, name: "英雄の盾", cost: 500, item_url: "imgs/items/item_023.png", category: "防具" },
  { id: 24, name: "力の腕輪", cost: 100, item_url: "imgs/items/item_024.png", category: "アクセサリ" },
  { id: 25, name: "スピードブーツ", cost: 200, item_url: "imgs/items/item_025.png", category: "アクセサリ" },
  { id: 26, name: "魔法の水晶", cost: 300, item_url: "imgs/items/item_026.png", category: "アクセサリ" },
  { id: 27, name: "金のブレスレット", cost: 300, item_url: "imgs/items/item_027.png", category: "アクセサリ" },
  { id: 28, name: "女神のチョーカー", cost: 500, item_url: "imgs/items/item_028.png", category: "アクセサリ" },
  { id: 29, name: "ルビーの宝玉", cost: 800, item_url: "imgs/items/item_029.png", category: "アクセサリ" },
  { id: 30, name: "ダイヤの指輪", cost: 1000, item_url: "imgs/items/item_030.png", category: "アクセサリ" },
]

items.each do |item_data|
  item = Item.find_by(id: item_data[:id])
  
  if item
    item.update(
      name: item_data[:name],
      cost: item_data[:cost],
      item_url: item_data[:item_url],
      category: item_data[:category]
    )
  else
    Item.create(
      id: item_data[:id],
      name: item_data[:name],
      cost: item_data[:cost],
      item_url: item_data[:item_url],
      category: item_data[:category]
    )
  end
end

# ジョブデータを挿入
jobs_data = [
  { id: 1, name: '冒険者', item_id: 1 },
  { id: 2, name: '戦士', item_id: 1 },
  { id: 3, name: '魔法使い', item_id: 1 },
  { id: 4, name: '僧侶', item_id: 1 },
  { id: 5, name: '武闘家', item_id: 1 },
  { id: 6, name: '狩人', item_id: 1 },
  { id: 7, name: '遊び人', item_id: 1 },
  { id: 8, name: 'バトルマスター', item_id: 2 },
  { id: 9, name: '賢者', item_id: 3 },
  { id: 10, name: 'アークプリースト', item_id: 4 },
  { id: 11, name: '忍者', item_id: 5 },
  { id: 12, name: 'スーパースター', item_id: 6 },
  { id: 13, name: '勇者', item_id: 7 }
]

jobs_data.each do |job|
  job_record = Job.find_by(id: job[:id])

  if job_record
    job_record.update(name: job[:name], item_id: job[:item_id])
  else
    Job.create(id: job[:id], name: job[:name], item_id: job[:item_id])
  end
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
