(function() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'checkVideo') {
            const videoUrl = window.location.href;
            sendResponse({ url: videoUrl });
        }
        return true;
    });

    function detectScoopzVideo() {
        const videoElements = document.querySelectorAll('video');
        if (videoElements.length > 0) {
            return {
                hasVideo: true,
                url: window.location.href,
                title: document.title.replace(' - Scoopz', '')
            };
        }
        return { hasVideo: false };
    }

    window.detectScoopzVideo = detectScoopzVideo;
})();
