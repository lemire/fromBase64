const fs = require('fs');
const path = require('path');

// Load all data at startup
console.log('Loading data...');

const bingBase64 = fs.readFileSync(path.join(__dirname, 'base64data/images/bing.txt'), 'utf8').trim();
const googlelogoBase64 = fs.readFileSync(path.join(__dirname, 'base64data/images/googlelogo.txt'), 'utf8').trim();

const dnsLines = fs.readFileSync(path.join(__dirname, 'base64data/dns/swedenzonebase.txt'), 'utf8').trim().split('\n').filter(line => line.trim());

let emailBase64s = [];
const emailDir = path.join(__dirname, 'base64data/email');
const emailFiles = fs.readdirSync(emailDir);
for (const file of emailFiles) {
    if (file.endsWith('.txt')) {
        emailBase64s.push(fs.readFileSync(path.join(emailDir, file), 'utf8').trim());
    }
}

console.log('Data loaded.');

// Function to decode using Uint8Array.fromBase64 if available, else fallback
function decodeBase64(str) {
    if (typeof Uint8Array.fromBase64 === 'function') {
        return Uint8Array.fromBase64(str);
    } else {
        // Fallback to Buffer
        return new Uint8Array(Buffer.from(str, 'base64'));
    }
}

// Benchmark function
function benchmark(name, fn, iterations = 100) {
    console.log(`Running benchmark: ${name}`);
    let totalBytes = 0;
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        times.push(end - start);
        totalBytes += result;
    }
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const avgBytesPerSec = (totalBytes / iterations) / (avgTime / 1000);
    const gbps = avgBytesPerSec / (1000 ** 3);
    const sortedTimes = [...times].sort((a, b) => a - b);
    const p10 = sortedTimes[Math.floor(0.1 * (sortedTimes.length - 1))];
    const p90 = sortedTimes[Math.floor(0.9 * (sortedTimes.length - 1))];
    const p10BytesPerSec = (totalBytes / iterations) / (p10 / 1000);
    const p90BytesPerSec = (totalBytes / iterations) / (p90 / 1000);
    const p10Gbps = p10BytesPerSec / (1000 ** 3);
    const p90Gbps = p90BytesPerSec / (1000 ** 3);
    console.log(`  10th percentile throughput: ${p10Gbps.toFixed(3)} GB/s`);
    console.log(`  Average throughput: ${gbps.toFixed(3)} GB/s`);
    console.log(`  90th percentile throughput: ${p90Gbps.toFixed(3)} GB/s`);

    console.log();
}

// Benchmarks
// 1. Decode each line of swedenzonebase.txt
benchmark('Decode each line of swedenzonebase.txt', () => {
    let total = 0;
    for (const line of dnsLines) {
        total += line.length; // Count input size for throughput calculation
        const decoded = decodeBase64(line);
    }
    return total;
});

// 2. Decode all email content
benchmark('Decode all email content', () => {
    let total = 0;
    for (const emailBase64 of emailBase64s) {
        total += emailBase64.length; // Count input size for throughput calculation
        const decoded = decodeBase64(emailBase64);
    }
    return total;
});

console.log('Benchmarks completed.');