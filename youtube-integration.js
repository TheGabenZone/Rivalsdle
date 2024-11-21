// YouTube API configuration
const YOUTUBE_API_KEY = 'AIzaSyCAiLSLuKkFlYfa96fie44MDirKHK3l9ks'; // Replace with actual API key
const LIVESTREAM_ID = '_CHvs_X7ajo';

// Global variable to store chat messages
window.currentLiveChatMessages = [];

// Initialize YouTube API
function initYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.googleapis.com/youtube/v3/live_chat';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Fetch live chat messages
async function fetchLiveChatMessages(liveChatId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/liveChat/messages?` +
            `liveChatId=${liveChatId}&` +
            `part=snippet,authorDetails&` +
            `maxResults=50&` + // Reduced from 200 to 50
            `key=${YOUTUBE_API_KEY}`
        );

        const data = await response.json();
        
        if (data.items) {
            // Update global messages array
            window.currentLiveChatMessages = data.items.map(item => ({
                author: item.authorDetails.displayName,
                message: item.snippet.displayMessage,
                timestamp: item.snippet.publishedAt
            })).slice(-20); // Keep only last 20 messages
        }
    } catch (error) {
        console.error('Error fetching live chat messages:', error);
    }
}

// Get live chat ID from livestream
async function getLiveChatId() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
            `id=${LIVESTREAM_ID}&` +
            `part=liveStreamingDetails&` +
            `key=${YOUTUBE_API_KEY}`
        );

        const data = await response.json();
        if (data.items && data.items[0].liveStreamingDetails) {
            return data.items[0].liveStreamingDetails.activeLiveChatId;
        }
    } catch (error) {
        console.error('Error getting live chat ID:', error);
    }
    return null;
}

// Start polling for chat messages
async function startChatPolling() {
    const liveChatId = await getLiveChatId();
    if (liveChatId) {
        // Poll every 5 seconds instead of 1 second
        setInterval(() => fetchLiveChatMessages(liveChatId), 5000);
    }
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    initYouTubeAPI();
    startChatPolling();
});