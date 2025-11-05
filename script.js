// Draw cake + candles
const canvas = document.getElementById("cakeCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let candlesLit = true;

  function drawCake() {
    ctx.clearRect(0, 0, 300, 300);

    // Cake base
    ctx.fillStyle = "#ffb6c1";
    ctx.fillRect(75, 200, 150, 60);

    // Frosting
    ctx.fillStyle = "#fff0f5";
    ctx.fillRect(75, 180, 150, 25);

    // Candles
    for (let i = 0; i < 3; i++) {
      const x = 110 + i * 30;
      ctx.fillStyle = "#ffe4e1";
      ctx.fillRect(x, 150, 10, 30);

      if (candlesLit) {
        ctx.beginPath();
        ctx.moveTo(x + 5, 150);
        ctx.lineTo(x, 140);
        ctx.lineTo(x + 10, 150);
        ctx.fillStyle = "#ff9900";
        ctx.fill();
      }
    }
  }
  drawCake();

  // Mic input to detect blowing
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const mic = audioCtx.createMediaStreamSource(stream);
    mic.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b) / data.length;
      if (avg > 60 && candlesLit) { // threshold
        candlesLit = false;
        drawCake();
        ctx.fillStyle = "#999";
        ctx.font = "12px 'Press Start 2P'";
        ctx.fillText("You blew the candles! 🎉", 15, 280);
        setTimeout(() => window.location.href = "bestfriend.html", 3000);
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  });
}
