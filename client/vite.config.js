import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': { // '/api'로 시작하는 요청을 프록시 처리
                target: 'http://localhost:8888', // 실제 API 서버 주소
                changeOrigin: true, // 대상 서버가 다른 출처라도 허용
            },
        },
    },
})