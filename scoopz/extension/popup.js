class ScoopzExtractor {
    constructor() {
        this.currentUrl = '';
        this.videoData = null;
        this.history = JSON.parse(localStorage.getItem('scoopzHistory')) || [];
        this.init();
    }

    init() {
        this.elements = {
            extractBtn: document.getElementById('extractBtn'),
            mp3Btn: document.getElementById('mp3Btn'),
            historyBtn: document.getElementById('historyBtn'),
            statusIcon: document.getElementById('status-icon'),
            statusText: document.getElementById('status-text'),
            status: document.getElementById('status'),
            quality: document.getElementById('quality'),
            historyPanel: document.getElementById('historyPanel'),
            historyList: document.getElementById('historyList')
        };

        this.bindEvents();
        this.checkCurrentTab();
    }

    bindEvents() {
        this.elements.extractBtn.addEventListener('click', () => this.extractAndDownload());
        this.elements.mp3Btn.addEventListener('click', () => this.downloadMP3());
        this.elements.historyBtn.addEventListener('click', () => this.toggleHistory());
        this.elements.quality.addEventListener('change', () => this.updateDownloadLinks());
        
        document.addEventListener('click', (e) => {
            if (!this.elements.historyPanel.contains(e.target) && 
                e.target !== this.elements.historyBtn) {
                this.elements.historyPanel.classList.remove('visible');
            }
        });
    }

    async checkCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentUrl = tab.url;
            
            if (this.isScoopzUrl(this.currentUrl)) {
                this.updateStatus(true, '✓ Ready to extract!');
                this.elements.extractBtn.disabled = false;
            } else {
                this.updateStatus(false, '✗ Not a Scoopz video');
                this.elements.extractBtn.disabled = true;
            }
        } catch (error) {
            console.error('Error checking tab:', error);
            this.updateStatus(false, '✗ Error checking page');
            this.elements.extractBtn.disabled = true;
        }
    }

    isScoopzUrl(url) {
        return url.includes('scoopz.com') || url.includes('scoopz.io') || 
               url.includes('scoopz.video') || /scoopz\./.test(url);
    }

    updateStatus(isReady, message) {
        this.elements.status.classList.remove('ready', 'error');
        this.elements.status.classList.add(isReady ? 'ready' : 'error');
        this.elements.statusIcon.textContent = isReady ? '✓' : '✗';
        this.elements.statusText.textContent = message;
    }

    async extractAndDownload() {
        if (!this.currentUrl || !this.isScoopzUrl(this.currentUrl)) {
            this.updateStatus(false, '✗ Invalid URL');
            return;
        }

        this.updateStatus(true, '⏳ Extracting...');
        this.elements.extractBtn.disabled = true;
        this.elements.extractBtn.classList.add('pulse');

        try {
            const extractUrl = `https://webtools-eight.vercel.app/api/scoopz/extract.js?video=${encodeURIComponent(this.currentUrl)}`;
            const response = await fetch(extractUrl);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.raw_url) {
                throw new Error('No video URL found');
            }

            this.videoData = {
                ...data,
                url: this.currentUrl,
                title: data.title || 'Scoopz Video',
                date: new Date().toLocaleDateString()
            };

            const quality = this.elements.quality.value;
            const downloadUrl = quality === 'auto' 
                ? `https://webtools-eight.vercel.app/api/scoopz/download.js?url=${encodeURIComponent(data.raw_url)}`
                : `https://webtools-eight.vercel.app/api/scoopz/download.js?url=${encodeURIComponent(data.raw_url)}&quality=${quality}`;

            this.updateStatus(true, '⏳ Downloading...');
            
            await this.downloadFile(downloadUrl, `${this.videoData.title}.mp4`);
            
            this.addToHistory(this.videoData);
            
            this.updateStatus(true, '✓ Download complete!');
            setTimeout(() => this.checkCurrentTab(), 2000);

        } catch (error) {
            console.error('Extraction error:', error);
            this.updateStatus(false, `✗ Error: ${error.message}`);
        } finally {
            this.elements.extractBtn.disabled = false;
            this.elements.extractBtn.classList.remove('pulse');
        }
    }

    async downloadMP3() {
        if (!this.videoData || !this.videoData.raw_url) {
            this.updateStatus(false, '✗ Extract video first');
            return;
        }

        try {
            const mp3Url = `https://webtools-eight.vercel.app/api/audio/extract.js?video=${encodeURIComponent(this.videoData.raw_url)}`;
            await this.downloadFile(mp3Url, `${this.videoData.title}.mp3`);
            
            this.updateStatus(true, '✓ MP3 downloaded!');
            setTimeout(() => this.checkCurrentTab(), 2000);
        } catch (error) {
            this.updateStatus(false, `✗ MP3 error: ${error.message}`);
        }
    }

    async downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            chrome.downloads.download({
                url: blobUrl,
                filename: filename,
                saveAs: true
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError.message);
                }
                URL.revokeObjectURL(blobUrl);
            });
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    }

    addToHistory(videoData) {
        const historyItem = {
            title: videoData.title,
            url: videoData.url,
            date: new Date().toLocaleString(),
            thumbnail: videoData.thumbnail || ''
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) this.history.pop();
        
        localStorage.setItem('scoopzHistory', JSON.stringify(this.history));
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.elements.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = '<div class="empty-history">No downloads yet</div>';
            return;
        }

        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>
                    <div class="history-title">${item.title}</div>
                    <div class="history-date">${item.date}</div>
                </div>
                <button class="history-download-btn" data-index="${index}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke-width="2"/>
                        <path d="M7 10L12 15L17 10" stroke-width="2"/>
                        <path d="M12 15V3" stroke-width="2"/>
                    </svg>
                </button>
            `;
            
            historyItem.querySelector('.history-download-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.redownloadFromHistory(index);
            });
            
            historyItem.addEventListener('click', () => {
                chrome.tabs.create({ url: item.url });
            });
            
            this.elements.historyList.appendChild(historyItem);
        });
    }

    toggleHistory() {
        this.elements.historyPanel.classList.toggle('visible');
        if (this.elements.historyPanel.classList.contains('visible')) {
            this.updateHistoryDisplay();
        }
    }

    async redownloadFromHistory(index) {
        const item = this.history[index];
        if (item) {
            this.currentUrl = item.url;
            await this.extractAndDownload();
        }
    }

    updateDownloadLinks() {
        if (this.videoData && this.videoData.raw_url) {
          // link here
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScoopzExtractor();
});
