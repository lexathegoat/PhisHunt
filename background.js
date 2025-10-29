let model = null;

async function loadModel() {
    const response = await fetch(chrome.runtime.getURL('phishing_model.onnx'));
    const arrayBuffer = await response.arrayBuffer();
    const session = new onnx.InferenceSession();
    await session.loadModel(arrayBuffer);
    model = session;
} 

loadModel();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type == "ANALYZE_URL" && model) {
        const input = new Float32Array(Object.values(message.features));
        const tensor = new onnx.Tensor(input, 'float32', [1, input.length]);

        const outputMap = await model.run([tensor]);
        const outputTensor = outputMap.values().next().value;
        const prediction = outputTensor.data[0] > 0.5 ? 1 : 0; 

        const result = {
            url: message.url,
            risk: prediction,
            score: outputTensor.data[0]
            safe: prediction === 0
        };

        chrome.action.setBadgeText({text: prediction ? "!" : "+", tabId: sende.tab.id});
        chrome.action.setBadgeBackgroundColor({color: prediction ? "#FF0000" : "#00FF00"});

        if (prediction) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'PhisHunt ALERT!',
                message: 'This site will be a malicious or phishing!'
            });
        }

        sendResponse(result);
    }
    return true;
})
