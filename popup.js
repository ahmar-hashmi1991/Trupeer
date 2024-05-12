let recording = false;
let startTime = null;

chrome.storage.local.get(["recording", "startTime"], (data) => {
  recording = data.recording || false;
  startTime = data.startTime || null;
  updateButtonState();
});

document.getElementById("recordBtn").addEventListener("click", () => {
  recording = !recording;
  if (recording) {
    startTime = Date.now();
    //chrome.runtime.sendMessage({ type: "startRecording" });
  } else {
    saveToFile();
    startTime = null;
    //chrome.runtime.sendMessage({ type: "stopRecording" });
  }
  chrome.storage.local.set({ "recording": recording, "startTime": startTime });
  updateButtonState();
});

function updateButtonState() {
  const btn = document.getElementById("recordBtn");
  if (recording) {
    btn.textContent = "Stop Recording";
  } else {
    btn.textContent = "Record";
  }
}

async function saveToFile() {
  // const elapsedTime = calculateElapsedTime(startTime);
  chrome.storage.local.get("clicks", (data) => {
    const clicks = data.clicks || [];
    const content = clicks
      .map((click, index) => {
        return `Click#${index + 1}    ${click.time}    ${click.x},${click.y}\n`;
      })
      .join("");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: "clicks.txt",
    });
  });
  chrome.storage.local.set({ "clicks": [] }).then(() => {
    console.log("Value is set");
  });
}