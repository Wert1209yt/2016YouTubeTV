const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchNextData(videoId) {
    const apiKey = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8';
    const apiUrl = `https://www.googleapis.com/youtubei/v1/next?key=${apiKey}`;

    // Fixed 'params' string provided
    const params = "qgMCZGG6AwoI5tiC0qjb9sRrugMKCNPa26_4mbGDJboDCgjYjIz7k73C8X26AwsIsuTT3PDW45rJAboDCgj_neig0riToyG6AwsI4Ifex42A0rbBAboDCwiBv8K9jND2_LkBugMLCJ6Oxdqf5r_QugG6AwsIiLTcqYLIvozQAboDCgi54P_p4OqE13m6AwsIkNCS1LL";

    // Ensure params is not empty or undefined
    if (!params || params.trim() === "") {
        throw new Error('"params" must be a non-empty string.');
    }

    // Construct the postData with the fixed 'params' string
    const postData = {
        context: {
            client: {
                clientName: 'TVHTML5',
                clientVersion: '5.20150715',
                screenWidthPoints: 600,
                screenHeightPoints: 275,
                screenPixelDensity: 2,
                theme: 'CLASSIC',
                webpSupport: false,
                acceptRegion: 'US',
                acceptLanguage: 'en-US',
            },
            user: {
                enableSafetyMode: false,
            },
        },
        params: params, // Using the fixed params string
        videoId: videoId, // Only pass the videoId
    };

    try {
        console.log('Sending request to YouTube /next API with payload:', postData);

        // Perform the POST request with axios
        const response = await axios.post(apiUrl, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Received response from YouTube /next API.');

        // Log the response data to a file
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFilePath = path.join(logsDir, `next-response-${timestamp}.json`);

        fs.writeFileSync(logFilePath, JSON.stringify(response.data, null, 2), 'utf-8');

        console.log('Response saved to:', logFilePath);

        return response.data;
    } catch (error) {
        console.error('Error fetching next data:', error.message);

        if (error.response && error.response.data) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }

        throw new Error('Failed to fetch data from YouTube /next API.');
    }
}

module.exports = { fetchNextData };
