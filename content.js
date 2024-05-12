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
