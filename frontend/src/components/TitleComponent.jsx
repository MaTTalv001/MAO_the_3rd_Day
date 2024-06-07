import React from "react";

export const TitleComponent = () => {
  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="bg-base-100 bg-opacity-60 p-4 rounded-lg mb-10">
        <div
          className="hero min-h-screen rounded-lg"
          style={{
            backgroundImage: `url("/imgs/title/title_story.jpg")`,
          }}
        >
          <div className="hero-overlay bg-opacity-70 rounded-lg"></div>
          <div className="hero-content text-center text-base-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-3xl font-bold">3日の力が魔王を討つ</h1>
              <p className="mb-5 text-xl">
                遥か昔、エナジアには人々の活力を吸い取る邪悪な魔王が存在した。あなたは新たな冒険者として、日々の活動を通じて成長し、この脅威に立ち向かう運命にある。3日の壁を超えると魔王の幻術が解け、あなたに挑戦の時が訪れる。エナジアの平和を守るため、勇敢に戦おう！
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-300 shadow-xl">
            <figure>
              <img src="/imgs/instruction/instruction001.jpg" alt="活動記録" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">活動記録</h2>
              <p>
                シンプルな操作で毎日の活動を記録。カテゴリに応じてキャラクターが成長します！継続習慣を身につけ魔王戦に備えましょう！
              </p>
            </div>
          </div>
          <div className="card bg-base-300 shadow-xl">
            <figure>
              <img
                src="/imgs/instruction/instruction002.jpg"
                alt="アバター生成"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">アバター生成</h2>
              <p>
                自分だけのオリジナルアバターを簡単な操作で生成！！専用アイテムを使って上級職にジョブチェンジもできます！
              </p>
            </div>
          </div>
          <div className="card bg-base-300 shadow-xl">
            <figure>
              <img src="/imgs/instruction/instruction003.jpg" alt="バトル" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">バトル</h2>
              <p>
                成長したキャラクターでモンスター討伐に挑みます。
                活動記録を3日継続すると魔王戦に挑むことができます！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
