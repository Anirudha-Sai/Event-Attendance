let userLoggedIn = true;
let html5QrCode;

function handleLogin(response) {
  const data = parseJwt(response.credential);
  userLoggedIn = true;
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("app").style.display = "block";
  alert(`Welcome ${data.name}!`);
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(atob(base64).split("").map(c =>
    "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(""));
  return JSON.parse(jsonPayload);
}

document.getElementById("scanBtn").addEventListener("click", () => {
  if (!userLoggedIn) {
    alert("Please login first!");
    return;
  }

  const reader = document.getElementById("reader");
  reader.innerHTML = ""; // clear previous reader UI
  document.getElementById("result").innerHTML = "";

  html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: 250 };

  html5QrCode.start(
    { facingMode: "environment" },
    config,
    async (decodedText, decodedResult) => {
      // Stop scanning immediately once we get a valid scan
      await html5QrCode.stop();
      showResult(decodedText);
    },
    (errorMessage) => {
      // silently ignore scanning errors
    }
  ).catch(err => {
    console.error("Camera access error:", err);
  });
});

function showResult(text) {
  const resultDiv = document.getElementById("result");
  document.getElementById("reader").innerHTML = "";

  resultDiv.innerHTML = `
    <h3>📦 Scanned Barcode:</h3>
    <div class="barcode-box">${text}</div>
    <div class="btns">
      <button id="confirmBtn">✅ Confirm</button>
      <button id="cancelBtn">❌ Cancel</button>
    </div>
  `;

  document.getElementById("confirmBtn").onclick = () => {
    alert("Data confirmed: " + text);
    resultDiv.innerHTML = "";
  };

  document.getElementById("cancelBtn").onclick = () => {
    alert("Scan canceled");
    resultDiv.innerHTML = "";
  };
}
