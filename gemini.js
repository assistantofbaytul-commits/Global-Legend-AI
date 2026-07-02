const API_KEY = "AQ.Ab8RN6IPlio6J7Jr6gvrF6GKFietBmSwJXQiB0uUTWiMqdT1Kw";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `
    <div class="message user">${message}</div>
  `;

  input.value = "";

  const thinkingId = "thinking-" + Date.now();

  chatBox.innerHTML += `
    <div class="message ai" id="${thinkingId}">
      🤖 Thinking...
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let reply = "No response.";

    if (
      data.candidates &&
      data.candidates.length > 0
    ) {
      reply =
        data.candidates[0].content.parts[0].text;
    }

    document.getElementById(thinkingId).innerHTML =
      "🤖 " + reply;
  } catch (err) {
    document.getElementById(thinkingId).innerHTML =
      "❌ Error: " + err.message;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}