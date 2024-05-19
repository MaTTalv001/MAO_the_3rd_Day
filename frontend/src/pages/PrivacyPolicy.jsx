import React from "react";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-10">
      <div className="container text-base-100 mx-auto px-8 mb-10 bg-white p-10 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold mb-4 text-center">
          プライバシーポリシー
        </h2>
        <div className="text-left space-y-4">
          <h3 className="text-2xl font-semibold">お客様から取得する情報</h3>
          <p>当社は、お客様から以下の情報を取得します。</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>氏名(ニックネームやペンネームも含む)</li>
            <li>
              外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報
            </li>
            <li>
              当社ウェブサイトの滞在時間、入力履歴、購買履歴等の当社ウェブサイトにおけるお客様の行動履歴
            </li>
            <li>
              当社アプリの起動時間、入力履歴、購買履歴等の当社アプリの利用履歴
            </li>
          </ul>
          <h3 className="text-2xl font-semibold">お客様の情報を利用する目的</h3>
          <p>
            当社は、お客様から取得した情報を、以下の目的のために利用します。
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              当社サービスに関する登録の受付、お客様の本人確認、認証のため
            </li>
            <li>お客様の当社サービスの利用履歴を管理するため</li>
            <li>
              当社サービスにおけるお客様の行動履歴を分析し、当社サービスの維持改善に役立てるため
            </li>
            <li>当社のサービスに関するご案内をするため</li>
            <li>お客様からのお問い合わせに対応するため</li>
            <li>当社の規約や法令に違反する行為に対応するため</li>
            <li>
              当社サービスの変更、提供中止、終了、契約解除をご連絡するため
            </li>
            <li>当社規約の変更等を通知するため</li>
            <li>以上の他、当社サービスの提供、維持、保護及び改善のため</li>
          </ul>
          <h3 className="text-2xl font-semibold">安全管理のために講じた措置</h3>
          <p>
            当社が、お客様から取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。
          </p>
          <h3 className="text-2xl font-semibold">第三者提供</h3>
          <p>
            当社は、お客様から取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめお客様の同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。
          </p>
          <p>但し、次の場合は除きます。</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>個人データの取扱いを外部に委託する場合</li>
            <li>当社や当社サービスが買収された場合</li>
            <li>
              事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）
            </li>
            <li>その他、法律によって合法的に第三者提供が許されている場合</li>
          </ul>
          <h3 className="text-2xl font-semibold">アクセス解析ツール</h3>
          <p>
            当社は、お客様のアクセス解析のために、「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。Googleアナリティクスについて、詳しくは以下からご確認ください。
          </p>
          <a
            href="https://marketingplatform.google.com/about/analytics/terms/jp/"
            target="_blank"
            className="text-blue-500"
          >
            https://marketingplatform.google.com/about/analytics/terms/jp/
          </a>
          <h3 className="text-2xl font-semibold">プライバシーポリシーの変更</h3>
          <p>
            当社は、必要に応じて、このプライバシーポリシーの内容を変更します。この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により周知または通知します。
          </p>
          <h3 className="text-2xl font-semibold">お問い合わせ</h3>
          <p>
            お客様の情報の開示、情報の訂正、利用停止、削除をご希望の場合は、トップページの問い合わせフォームからご連絡ください。
          </p>
          <p>
            この場合、必ず、運転免許証のご提示等当社が指定する方法により、ご本人からのご請求であることの確認をさせていただきます。なお、情報の開示請求については、開示の有無に関わらず、ご申請時に一件あたり1,000円の事務手数料を申し受けます。
          </p>
          <h3 className="text-2xl font-semibold">事業者の氏名</h3>
          <p>MaTTa</p>
          <h3 className="text-2xl font-semibold">事業者の住所</h3>
          <p>2024年05月19日 制定</p>
        </div>
      </div>
    </div>
  );
};
