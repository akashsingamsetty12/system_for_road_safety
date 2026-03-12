/**
 * Server Configuration
 * 
 * Points to the admin-web server which runs separately
 * Admin-web server must be running before opening the map
 * 
 * Run: cd admin-web && npm start
 */

const SERVER_IP = '10.104.154.182'; // Your machine IP
const SERVER_PORT = 3000;

export const SERVER_BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;
export const MAP_URL = `${SERVER_BASE_URL}/map.html`;
export const DASHBOARD_URL = SERVER_BASE_URL;

console.log('📡 Server Configuration:');
console.log(`   Base URL: ${SERVER_BASE_URL}`);
console.log(`   Map URL: ${MAP_URL}`);
