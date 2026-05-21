const fs = require('fs');
const path = require('path');

// Build-time configuration generator.
// Use API_URL in deployment environments to point the frontend to the Render backend.
const apiBaseUrl = process.env.API_URL || 'https://devops-rkyj.onrender.com';
const configPath = path.resolve(__dirname, '..', 'public', 'config.js');

const configContents = `// Generated frontend configuration.
window.APP_CONFIG = window.APP_CONFIG || {};
const defaultApiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '${apiBaseUrl}';
window.APP_CONFIG.apiBaseUrl = window.APP_CONFIG.apiBaseUrl || defaultApiUrl;
`;

// Ensure the public directory exists before writing the generated config file.
fs.mkdirSync(path.dirname(configPath), { recursive: true });
fs.writeFileSync(configPath, configContents, 'utf8');
console.log(`Generated public/config.js with API_URL=${apiBaseUrl}`);
