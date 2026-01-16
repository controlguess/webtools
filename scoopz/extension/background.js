chrome.runtime.onInstalled.addListener(() => {
    console.log('ScoopzRip Extension installed');
});

chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === 'complete') {
        console.log('Download completed:', delta.id);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'DOWNLOAD_VIDEO') {
        chrome.downloads.download({
            url: message.url,
            filename: message.filename,
            saveAs: true
        });
    }
    return true;
});
