import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import GraphService from '../services/GraphService.js';
import winston from 'winston';
import { agentLogger } from '../config/winston.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 로드 (api 디렉토리에 있음)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// console 출력을 위해 logger에 transport 추가
agentLogger.add(new winston.transports.Console({
    format: winston.format.simple()
}));

async function runTest() {
    const userEmail = 'room0@mirageworks.co.kr';
    
    // 최근 1달 검색 (2026-03-11 ~ 2026-04-11)
    const start = '2026-03-11T00:00:00Z';
    const end = '2026-04-11T23:59:59Z';

    console.log(`[TEST] Fetching calendar for: ${userEmail}`);
    console.log(`[TEST] Range: ${start} ~ ${end}`);

    try {
        console.log('[TEST] Step 1: Getting App Access Token...');
        const token = await GraphService.getAppAccessToken();
        console.log('[TEST] Token acquired (starts with):', token.substring(0, 20) + '...');

        console.log('[TEST] Step 2: Fetching Calendar View (Direct Call for Debug)...');
        const url = `https://graph.microsoft.com/v1.0/users/${userEmail}/calendarView?startDateTime=${start}&endDateTime=${end}`;
        try {
            const response = await axios.get(url, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Prefer': 'outlook.timezone="Korea Standard Time"'
                }
            });
            const events = response.data.value;
            console.log('\n[TEST] Result:');
            if (events.length === 0) {
                console.log('No events found for this period. (Confirmed by direct API call)');
            } else {
                console.log(`Found ${events.length} events (FULL DATA):`);
                events.forEach((event, index) => {
                    console.log(`\n--- Event #${index + 1} ---`);
                    console.log(JSON.stringify(event, null, 2));
                });
            }
        } catch (apiError) {
            console.error('\n[TEST] API Direct Call error:');
            console.error('Status:', apiError.response?.status);
            console.error('Data:', JSON.stringify(apiError.response?.data, null, 2));
        }
    } catch (error) {
        console.error('\n[TEST] Error occurred during process:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

runTest();
