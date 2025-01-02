require('dotenv').config();
const http = require('http');
const httpProxy = require('http-proxy');

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_SECRET = process.env.INFURA_SECRET;

if (!INFURA_API_KEY || !INFURA_SECRET) {
    console.error('Error: INFURA_API_KEY and INFURA_SECRET must be set in .env file');
    process.exit(1);
}

const proxy = httpProxy.createProxyServer({});

// Error handling
proxy.on('error', function(err, req, res) {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Proxy error');
});

// Optional logging
proxy.on('proxyReq', function(proxyReq, req, res, options) {
    console.log('Proxying request to:', options.target);
});

proxy.on('proxyRes', function(proxyRes, req, res) {
    console.log('Proxy response:', proxyRes.statusCode);
});

const server = http.createServer((req, res) => {
  res.send('Hello from proxy server');
    const target = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
    
    console.log('Request URL:', target);
    console.log('Request headers:', req.headers);
    
    proxy.web(req, res, {
        target: target,
        changeOrigin: true,
        secure: true
    });

});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Infura proxy server running on port ${PORT}`);
}); 