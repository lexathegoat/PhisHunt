chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, {type: "GET_RESULT"}, (response) => {
    if (response) {
      const el = document.getElementById("result");
      if (response.safe) {
        el.innerHTML = `<span class="safe">Secure</span><br>Skor: ${(response.score*100).toFixed(1)}%`;
      } else {
        el.innerHTML = `<span class="danger">PHISHING!</span><br>Skor: ${(response.score*100).toFixed(1)}%`;
      }
    }
  });
});
