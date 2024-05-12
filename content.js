document.addEventListener("click", (event) => {
  let startTime = null;
  if (chrome && chrome.storage) {
    chrome.storage.local.get("startTime", (data) => {
      startTime = data.startTime || null;
      if (event.target.tagName !== "BODY") {
        const elapsedTime = calculateElapsedTime(startTime);
        const click = {
          time: elapsedTime,
          x: event.clientX,
          y: event.clientY
        };
        saveClicksToStorage(click);
      }
    });  
  }
});
function calculateElapsedTime(startTime) {
  if (!startTime) return "00:00";
  const elapsed = Math.floor((Date.now() - startTime) / 1000); // in seconds
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// chrome.storage.local.get("recording", (data) => {
//   if (data.recording) {
//     startTime = Date.now();
//     chrome.storage.local.set({ "startTime": startTime });
//   }
// });

function saveClicksToStorage(click) {
  chrome.storage.local.get("clicks", (data) => {
    let clicks = data.clicks || [];
    clicks.push(click);
    chrome.storage.local.set({ "clicks": clicks }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving clicks to storage:", chrome.runtime.lastError);
      }
    });
  });
}

// let mediaRecorder = null;
// let recordedChunks = [];

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "startRecording") {
//     startRecording(message.stream);
//   } else if (message.action === "stopRecording") {
//     stopRecording();
//   }
// });

// function startRecording(stream) {
//   mediaRecorder = new MediaRecorder(stream);
//   mediaRecorder.ondataavailable = handleDataAvailable;
//   mediaRecorder.onstop = handleRecordingStop;
//   recordedChunks = [];
//   mediaRecorder.start();
// }

// function stopRecording() {
//   if (mediaRecorder && mediaRecorder.state !== "inactive") {
//     mediaRecorder.stop();
//   }
// }

// function handleDataAvailable(event) {
//   if (event.data.size > 0) {
//     recordedChunks.push(event.data);
//   }
// }

// function handleRecordingStop() {
//   const blob = new Blob(chunks, { type: "video/webm" });
//   const url = URL.createObjectURL(blob);
//   chrome.downloads.download({
//     url: url,
//     filename: "screen_recording.webm"
//   });
// }