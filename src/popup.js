
document.addEventListener('DOMContentLoaded', function() {
    const myButton = document.getElementById('askGPTBUTTON');
    myButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting.executeScript(
                {
                    target: {tabId: tabs[0].id, allFrames: true},
                    files: ['src/index.js']
                }
            );
            chrome.scripting.insertCSS({
                files: ["spin.css"],
                target: {tabId: tabs[0].id, allFrames: true},
            });
        });
        window.close();
    });
});
