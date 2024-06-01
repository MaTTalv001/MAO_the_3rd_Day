//URLを受け取りXにポストする
export const handleTweet = (generatedAvatar, FRONT_URL) => {
  const baseUrl = "https://mao-the-3rd-day.s3.ap-northeast-1.amazonaws.com/";
  const imagePath = generatedAvatar.replace(baseUrl, "");
  const tweetText = `魔王を討伐するためにアバターを作りました！ #みかまお`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    `${FRONT_URL}/public_avatar?image=${imagePath}`
  )}&text=${encodeURIComponent(tweetText)}`;

  window.open(twitterUrl, "_blank");
};
