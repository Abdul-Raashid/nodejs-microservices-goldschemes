// api-gateway/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'api-gateway' });
});

// Routes
app.use('/api/users', proxy(process.env.USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/users${req.url}`
}));

app.use('/api/schemes', proxy(process.env.GOLD_SCHEME_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/schemes${req.url}`,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward authorization headers to the target service
    if (srcReq.headers.authorization) {
      proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
    }
    return proxyReqOpts;
  }
}));

app.use('/api/purchases', proxy(process.env.GOLD_SCHEME_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/purchases${req.url}`,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward authorization headers to the target service
    if (srcReq.headers.authorization) {
      proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
    }
    return proxyReqOpts;
  }
}));

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});