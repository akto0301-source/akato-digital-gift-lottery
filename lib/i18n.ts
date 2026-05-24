import type { GiftLocale } from "@/lib/gift-links";

export type BlessingCard = {
  id: string;
  zh: {
    label: string;
    title: string;
    description: string;
    selectedText: string;
    messages: string[];
  };
  ja: {
    label: string;
    title: string;
    description: string;
    selectedText: string;
    messages: string[];
  };
};

export const locales: GiftLocale[] = ["zh", "ja"];

export const blessingCards: BlessingCard[] = [
  {
    id: "gentle-care",
    zh: {
      label: "GENTLE CARE",
      title: "溫柔療癒",
      description: "把想說的話寫進這張祝福籤裡。",
      selectedText: "已選",
      messages: [
        "願你今天被溫柔對待，\n所有美好都剛好發生。",
        "如果你有一點累，\n願今天剛好有人替你把心接住。",
        "願你在不必逞強的時候，\n也能安心做自己。",
        "慢一點也沒關係，\n先把呼吸放輕就好。",
        "今天不用撐成誰的期待，\n只要好好待在自己身邊。",
        "願你被柔軟包住，\n把緊繃慢慢放下。",
      ],
    },
    ja: {
      label: "GENTLE CARE",
      title: "やさしい癒し",
      description: "伝えたい言葉を、この祝福のおみくじにそっと入れます。",
      selectedText: "選択中",
      messages: [
        "今日は少しだけでも、\nやわらかい気持ちで過ごせますように。",
        "もし少し疲れていたら、\nこの言葉がそっと隣にいられますように。",
        "無理をしすぎないで、\nあなたのペースでいてください。",
        "急がなくても大丈夫。\nまずは深呼吸からでいいです。",
        "今日は誰かの期待より、\n自分をいたわる方を選んでください。",
        "やわらかい時間が、\nあなたのまわりに静かに増えますように。",
      ],
    },
  },
  {
    id: "calm-days",
    zh: {
      label: "CALM WISHES",
      title: "平安順心",
      description: "留一張給正在慢慢整理心情的人。",
      selectedText: "已選",
      messages: [
        "願你心裡有安定，\n腳步也慢慢回到舒服的節奏。",
        "不急著把一切想通也沒關係，\n今天先好好過就很好。",
        "願你在平凡的一天裡，\n也能感覺到平靜正慢慢靠近。",
        "願今天的路都比想像中順一點，\n心也比昨天更安穩。",
        "把步伐放穩，\n事情會一件一件到位。",
        "願你出門平安、做事順手、\n心裡也有踏實的底氣。",
      ],
    },
    ja: {
      label: "CALM WISHES",
      title: "おだやかな日々",
      description: "気持ちを少し整えたい人へ贈る一枚です。",
      selectedText: "選択中",
      messages: [
        "気持ちが少しずつでも、\n落ち着く方へ向かっていきますように。",
        "全部を急いで整えなくても、\n今日は今日のままで大丈夫です。",
        "なんでもない一日が、\n少しやさしく感じられますように。",
        "今日の道のりが少し順調で、\n心も静かに整いますように。",
        "足もとをそっと整えたら、\n物事はちゃんと進んでいきます。",
        "外でも内でも、\n安心して過ごせる時間が増えますように。",
      ],
    },
  },
  {
    id: "thank-you-light",
    zh: {
      label: "GRATEFUL LIGHT",
      title: "感謝有你",
      description: "把沒說出口的感謝，安靜送到對方手上。",
      selectedText: "已選",
      messages: [
        "謝謝你出現在我的生活裡，\n很多時候都比你想像得更重要。",
        "有你在的日子，\n一些普通時刻也變得很值得記得。",
        "想跟你說一聲謝謝，\n因為你的存在本身就很溫暖。",
        "因為有你，\n很多事才變得放心。",
        "謝謝你一直都在，\n這份安心我會記得。",
        "你讓我知道，\n被理解和被支持有多珍貴。",
      ],
    },
    ja: {
      label: "GRATEFUL LIGHT",
      title: "ありがとうの灯り",
      description: "言葉にしきれない感謝を、静かに届けるための一枚です。",
      selectedText: "選択中",
      messages: [
        "いてくれてありがとう。\nそれだけで助けられている日があります。",
        "あなたがいると、\n何気ない時間までやさしく見えます。",
        "ちゃんと伝えたかったです。\nいつも本当にありがとう。",
        "あなたのおかげで、\n安心して進めることがたくさんあります。",
        "そばにいてくれることが、\n何より心強いです。",
        "支えてくれる存在がいるって、\nこんなに大きいんだと感じています。",
      ],
    },
  },
  {
    id: "tender-arrival",
    zh: {
      label: "TENDER ARRIVAL",
      title: "晚到的心意",
      description: "有些祝福晚了一點，還是值得好好送達。",
      selectedText: "已選",
      messages: [
        "雖然這句祝福來得晚了一點，\n但想念和心意都是真的。",
        "有些話繞了一圈才說出口，\n還好最後還是來到你面前。",
        "時間晚了沒關係，\n希望這份心意還是剛好讓你笑一下。",
        "補送雖然遲了，\n但我沒有忘記你。",
        "來晚的不是心，\n只是我想把話好好說完。",
        "如果錯過了時機，\n那就讓這份心意慢一點抵達。",
      ],
    },
    ja: {
      label: "TENDER ARRIVAL",
      title: "すこし遅れた気持ち",
      description: "少し遅れても、ちゃんと届けたい気持ちのための一枚です。",
      selectedText: "選択中",
      messages: [
        "少し遅くなったけれど、\nちゃんと届けたくて書きました。",
        "タイミングは少しあとになったけれど、\n気持ちはずっとここにありました。",
        "今さら、じゃなくて今だからこそ、\nそっと渡したい言葉です。",
        "遅れてしまったけれど、\nそれでも伝えたいことがありました。",
        "届くのが少し後になっても、\n気持ちが薄れたわけじゃありません。",
        "間に合わなかった分まで、\nしっかり心をこめて届けます。",
      ],
    },
  },
  {
    id: "birthday-bloom",
    zh: {
      label: "BIRTHDAY BLOOM",
      title: "生日祝福",
      description: "給重要的人，一張剛剛好的生日小籤。",
      selectedText: "已選",
      messages: [
        "願新的一歲，\n有光、有花，也有很多安心的瞬間。",
        "生日快樂。\n願你把喜歡的日子慢慢過成生活。",
        "希望接下來的一年，\n你被愛著，也被自己好好照顧。",
        "生日這天，\n願好運、花香和笑容一起圍著你。",
        "新的一歲，\n願你被祝福包圍，也被夢想照亮。",
        "願今天開始的每一步，\n都比去年更閃亮一點。",
      ],
    },
    ja: {
      label: "BIRTHDAY BLOOM",
      title: "お誕生日の祝福",
      description: "大切な人へ贈る、ちょうどいいやさしさの誕生日みくじです。",
      selectedText: "選択中",
      messages: [
        "お誕生日おめでとう。\nこれからの毎日に、小さなうれしさが増えますように。",
        "新しい一年が、\nあなたにとってやさしい景色でありますように。",
        "がんばる日も休む日も、\nあなたらしく過ごせる一年になりますように。",
        "花と光と笑顔が、\n今日のあなたをやさしく包みますように。",
        "新しい一年は、\n祝福に満ちたまぶしい日々になりますように。",
        "今日から始まる一年が、\n好きなものに囲まれた時間になりますように。",
      ],
    },
  },
  {
    id: "shared-blessing",
    zh: {
      label: "SHARED BLESSING",
      title: "合送祝福",
      description: "把很多人的心意，收進同一張復古祝福籤裡。",
      selectedText: "已選",
      messages: [
        "這份祝福不只來自一個人，\n是很多惦記一起輕輕放到你手上的。",
        "想把大家的心意一起送給你，\n願你知道自己一直被放在心上。",
        "這是一張集合了好多溫柔的籤，\n希望你收下時會覺得很暖。",
        "我們一起把祝福整理好，\n希望你收到的是滿滿一群人的心意。",
        "這不是單獨送出的話，\n而是大家一起點亮的祝福。",
        "願你知道，\n這份暖意是很多人一起替你準備的。",
      ],
    },
    ja: {
      label: "SHARED BLESSING",
      title: "みんなからの祝福",
      description: "いくつもの気持ちを、一枚のレトロなおみくじに重ねて贈ります。",
      selectedText: "選択中",
      messages: [
        "この言葉は、ひとりぶんじゃなくて\nいくつものやさしさを重ねて贈ります。",
        "みんなの気持ちを少しずつ集めて、\nあなたに届けたくなりました。",
        "ひとつずつ違う想いだけど、\nどれもあなたを大切に思う気持ちです。",
        "私たちみんなで、\nひとつの祝福としてあなたに届けます。",
        "それぞれの気持ちを束ねて、\n今日はあなたへまっすぐ贈ります。",
        "ひとりではなく、\nみんなで包むあたたかさを受け取ってください。",
      ],
    },
  },
];

const extraMessages = {
  zh: [
    "願你在平凡的日子裡，也總能遇見剛剛好的溫柔。",
    "希望這份心意，替你把今天多留下一點柔軟和光。",
    "願你被在乎、被惦記，也被世界輕輕善待。",
    "如果最近有點累，願這一句話剛好替你擋住一點風。",
    "願你抬頭時有光，低頭時有安心，回頭時有溫暖的人。",
    "希望你收下的不只是祝福，還有被好好放在心上的感覺。",
  ],
  ja: [
    "なんでもない今日にも、やさしい瞬間が少しありますように。",
    "この気持ちが、今日のあなたの心を少しだけ軽くできますように。",
    "ちゃんと気にかけている人がいること、そっと伝わったらうれしいです。",
    "もし最近少しがんばりすぎていたら、今日は少しだけ肩の力を抜けますように。",
    "顔を上げたときに光があって、立ち止まったときに安心がありますように。",
    "この手紙で、あなたが大切に思われていることも一緒に届きますように。",
  ],
} satisfies Record<GiftLocale, string[]>;

export function getLocaleCopy(locale: GiftLocale) {
  const isJa = locale === "ja";

  return {
    locale,
    htmlLang: isJa ? "ja" : "zh-Hant",
    switcher: {
      zhLabel: "中文",
      jaLabel: "日本語",
      zhHref: "/",
      jaHref: "/ja",
    },
    hero: {
      eyebrow: "AKATO GIFT LOTTERY",
      title: isJa ? "Akato おみくじギフト" : "Akato 抽籤回禮系統",
      subtitle: isJa
        ? "今日のために、ちょうどいいやさしさを一枚。"
        : "把想說的心意寫進復古祝福籤，送給今天重要的人。",
    },
    entry: {
      eyebrow: isJa ? "ギフト入口" : "送禮入口",
      title: isJa ? "大切な人へ、専用の祝福ページを作る" : "為重要的人準備一頁專屬祝福",
      lead: isJa
        ? "贈る人、受け取る人、伝えたい言葉を入力すると、共有できる Akato の祝福リンクを作成できます。"
        : "填入送禮人、收禮人與祝福內容後，就能快速生成可分享的 Akato 祝福連結。",
      fromLabel: isJa ? "贈る人 from" : "送禮人 from",
      toLabel: isJa ? "受け取る人 to" : "收禮人 to",
      messageLabel: isJa ? "伝えたい言葉" : "想說的話 / 祝福內容",
      fromPlaceholder: isJa ? "例：美香" : "例如：嫥慧",
      toPlaceholder: isJa ? "例：翔太" : "例如：鄭羽喬",
      messagePlaceholder: isJa
        ? "ここに伝えたい言葉を書いてください"
        : "寫下一段溫柔祝福，讓收禮頁面直接帶著你的心意。",
      summaryFallback: isJa ? "贈る人 ➜ 受け取る人" : "送禮人 ➜ 收禮人",
      templateEyebrow: isJa ? "祝福のおみくじを選ぶ" : "選擇祝福籤詩",
      templateLead: isJa
        ? "一枚を選ぶと、その復古風のおみくじに祝福の言葉が入ります。"
        : "先挑一張溫柔的籤詩，再依照心意微調內容。",
      primaryButton: isJa ? "専用リンクを作成する" : "產生專屬祝福連結",
      generatingButton: isJa ? "作成中..." : "產生中...",
      copyButton: isJa ? "リンクをコピー" : "複製連結",
      copiedButton: isJa ? "コピーしました" : "已複製連結",
      shareButton: isJa ? "共有する" : "分享",
      previewButton: isJa ? "この手紙を開く" : "打開這封信",
      refreshHint: isJa
        ? "内容を更新したので、もう一度リンクを作成してください 🌸"
        : "內容已更新，請重新產生祝福連結 🌸",
      shareText: isJa
        ? (from: string, to: string, shareUrl: string) =>
            `Akato から小さな手紙を贈ります。\n\n${from} → ${to}\n\n${shareUrl}`
        : (from: string, to: string, shareUrl: string) =>
            `🥕 ${from} → ${to}\n\n我準備了一份祝福給你。\n點開信封，收下這份心意 ✉️\n\n${shareUrl}`,
    },
    confirm: {
      eyebrow: isJa ? "Akato Gift" : "Akato Gift",
      recipientFallback: isJa ? "受け取る人" : "收禮人",
      meta: isJa
        ? (from: string) => `${from || "贈る人"} から、あなたへ贈ります。`
        : (from: string) => `這份祝福由 ${from || "送禮人"} 為你送上。`,
      messageFallback: isJa
        ? "今日という日に、ちょうどよくやさしい言葉が届きますように。"
        : "願今天的心意，正好落在你最需要被溫柔接住的時候。",
      extraLead: isJa ? "この気持ち、まだ少し続きます。" : "這份心意還想對你說⋯",
      shuffleButton: isJa ? "ひとこと変えてみる" : "換一句看看",
      footerButton: isJa ? "大切な人にも贈る" : "我也想送給重要的人",
      footerHref: isJa ? "/ja" : "/",
    },
    extraMessages: extraMessages[locale],
  };
}
