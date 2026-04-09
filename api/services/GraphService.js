import axios from 'axios';
import { agentLogger } from '../config/winston.js';

/**
 * Microsoft Graph API Service (Application Context)
 * - 사용자의 직접적인 개입 없이 서버-대-서버로 일정을 읽고 쓰는 마스터 서비스입니다.
 */
class GraphService {
    /**
     * Microsoft Entra ID로부터 Application 전용 Access Token을 획득합니다.
     * (Azure Portal에서 설정한 Application Permissions 권한이 적용된 토큰)
     */
    static async getAppAccessToken() {
        const tenantId = process.env.TENANT_ID;
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        if (!tenantId || !clientId || !clientSecret) {
            agentLogger.error('[GraphService] Missing Microsoft credentials in .env');
            throw new Error('Microsoft 연동에 필요한 환경변수가 누락되었습니다.');
        }

        const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            scope: 'https://graph.microsoft.com/.default'
        });

        try {
            const response = await axios.post(url, params.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data.access_token;
        } catch (error) {
            const errorMsg = error.response?.data?.error_description || error.message;
            agentLogger.error(`[GraphService] Token Fetch Error: ${errorMsg}`);
            throw new Error('Microsoft 인증 토큰을 획득하지 못했습니다.');
        }
    }

    /**
     * 특정 직원의 일정 데이터를 조회합니다. (CalendarView 사용)
     * @param {string} userEmail 조회 대상 직원의 이메일 (UPN)
     * @param {string} start ISO String (예: 2024-04-10T00:00:00Z)
     * @param {string} end ISO String (예: 2024-04-10T23:59:59Z)
     */
    static async getUserCalendarView(userEmail, start, end) {
        if (!userEmail) throw new Error('조회할 이메일 주소가 없습니다.');

        try {
            const token = await this.getAppAccessToken();
            // calendarView는 반복 일정(Recurring)을 모두 개별 이벤트로 펼쳐서 보여주므로 실질적인 일정 파악에 유리합니다.
            const url = `https://graph.microsoft.com/v1.0/users/${userEmail}/calendarView?startDateTime=${start}&endDateTime=${end}`;

            const response = await axios.get(url, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Prefer': 'outlook.timezone="Korea Standard Time"' // 한국 시간대 선호 설정
                }
            });

            // 결과 데이터 정제
            return response.data.value.map(event => ({
                id: event.id,
                subject: event.subject, // 제목
                start: event.start.dateTime,
                end: event.end.dateTime,
                location: event.location?.displayName || '장소 정보 없음',
                isOnline: event.isOnlineMeeting, // 온라인 미팅 여부
                organizer: event.organizer?.emailAddress?.name, // 주최자
                preview: event.bodyPreview // 본문 미리보기
            }));
        } catch (error) {
            agentLogger.error(`[GraphService] CalendarView Fetch Error [${userEmail}]: ${error.message}`);
            // 에러를 던지지 않고 빈 배열을 반환하여 전체 프로세스가 중단되지 않게 함
            return [];
        }
    }
}

export default GraphService;
