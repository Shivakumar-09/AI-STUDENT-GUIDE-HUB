const https = require('https');

const hostname = 'ac-qrqyumv-shard-00-00.r43scbx.mongodb.net';
const url = `https://dns.google/resolve?name=${hostname}&type=A`;

console.log(`Querying ${url}...`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.Answer) {
                console.log("✅ DoH Success! Found IPs:");
                json.Answer.forEach(ans => {
                    console.log(`   - ${ans.data}`);
                });
            } else {
                console.log("❌ DoH Response received but no Answer found:", json);
            }
        } catch (e) {
            console.error("❌ Failed to parse DoH response:", e.message);
        }
    });

}).on('error', (err) => {
    console.error("❌ DoH Request Failed:", err.message);
});
