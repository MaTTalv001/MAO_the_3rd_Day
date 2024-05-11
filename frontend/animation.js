document.addEventListener("DOMContentLoaded", () => {
  const heart = document.querySelector(".fa-heart");

  // ハートのスケールアニメーション
  function heartScaleAnimation() {
    heart.style.transform = "scale(1.2)";
    setTimeout(() => {
      heart.style.transform = "scale(1)";
    }, 300);
  }

  // ハートの波紋エフェクト
  function heartRippleEffect() {
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    heart.appendChild(ripple);

    ripple.style.animation = "ripple-effect 0.6s linear";
    ripple.style.opacity = "1";

    setTimeout(() => {
      ripple.style.opacity = "0";
      setTimeout(() => {
        heart.removeChild(ripple);
      }, 600);
    }, 600);
  }

  // いいねボタンのクリックイベントリスナー
  heart.addEventListener("click", () => {
    heart.classList.toggle("liked");

    if (heart.classList.contains("liked")) {
      heartScaleAnimation();
      heartRippleEffect();
    }
  });
});
