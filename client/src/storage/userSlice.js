import { createSlice } from '@reduxjs/toolkit'

export const TOKEN_TIME_OUT = 600*1000

export const getUser = () => {
    const userStr = sessionStorage.getItem('user')
	if (!userStr) {
		return {}
	}
	const userState = JSON.parse(userStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > userState.expiry) {
		// If the item is expired, delete the item from storage
		sessionStorage.removeItem('user')
		return {}
	}
	return userState 
}

const user = getUser()

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: user.name || '',
        email: user.email || '',
        isAdmin: user.IsAdmin || false,
        department: user.department || '',
        cardNo: user.cardNo || '',
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
            state.department = action.payload.department
            state.cardNo = action.payload.cardNo
            state.isLogin = true
            state.expiry = now.getTime() + 86400000
            sessionStorage.setItem('user', JSON.stringify(state))
            // state 변화를 알림
            return state
        },
        // login 실패 시
        clearUser: (state) => {
            // name, id 값을 비워줌.
            state.name = ''
            state.email = ''
            state.isAdmin = false
            state.department = ''
            state.cardNo = ''
            state.isLogin = false 
            state.expiry = 0
            sessionStorage.removeItem('user')
            // state 변화를 알림
            return state
        },
    },
})

export const { loginUser, clearUser } = userSlice.actions
export default userSlice.reducer