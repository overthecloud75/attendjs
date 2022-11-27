import { createSlice } from '@reduxjs/toolkit'

export const TOKEN_TIME_OUT = 600*1000

const user = JSON.parse(localStorage.getItem('user')) || {}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: user.name || '',
        email: user.email || '',
        isAdmin: user.IsAdmin || false,
        isLogin: user.isLogin || false,
        expiry: user.expiry || 0 
    },
    reducers: {
        // login 성공 시
        loginUser: (state, action) => {
            const now = new Date()
            // name, id에 API 값 받아오기
            state.name = action.payload.name
            state.email = action.payload.email
            state.isAdmin = action.payload.isAdmin
            state.isLogin = true
            state.expiry = now.getTime() + 86400000
            localStorage.setItem('user', JSON.stringify(state))
            // state 변화를 알림
            return state
        },
        // login 실패 시
        clearUser: (state) => {
            // name, id 값을 비워줌.
            state.name = ''
            state.email = ''
            state.isAdmin = false
            state.isLogin = false 
            state.expiry = 0
            localStorage.removeItem('user')
            // state 변화를 알림
            return state
        },
    },
})

export const { loginUser, clearUser } = userSlice.actions
export default userSlice.reducer