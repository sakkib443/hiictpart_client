const https = require('https');

const url = 'https://hiictpark-backend.vercel.app/api/health';

console.log(`Checking ${url}...`);

https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
