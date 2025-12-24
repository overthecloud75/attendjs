import { createSlice } from '@reduxjs/toolkit'

const defaultState = {
    _id: '',
    employeeId: '',
    name: '',
    email: '',
    isAdmin: false,
    department: '',
    rank: '',
    regular: '',
    beginDate: '',
    isLogin: false,
    expiry: 0
}

const loadUserFromStorage = () => {
    try {
        const userStr = sessionStorage.getItem('user')
        if (!userStr) {
            return defaultState
        }
        const userState = JSON.parse(userStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > userState.expiry) {
            // If the item is expired, delete the item from storage
            sessionStorage.removeItem('user')
            return defaultState
        }
        return { ...defaultState, ...userState }
    } catch (e) {
        return defaultState
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: loadUserFromStorage(),
    reducers: {
        // login 성공 시
        loginUser: (state, action) => {
            const now = new Date()
            // name, id에 API 값 받아오기
            const newState = {
                ...state,
                _id: action.payload._id,
                employeeId: action.payload.employeeId,
                name: action.payload.name,
                email: action.payload.email,
                isAdmin: action.payload.isAdmin,
                department: action.payload.department,
                rank: action.payload.rank,
                regular: action.payload.regular,
                beginDate: action.payload.beginDate,
                isLogin: true,
                expiry: now.getTime() + 86400000 // 24 hours
            }
            sessionStorage.setItem('user', JSON.stringify(newState))
            return newState
        },
        // login 실패 시
        clearUser: () => {
            sessionStorage.removeItem('user')
            return defaultState
        },
    },
})

export const { loginUser, clearUser } = userSlice.actions
export default userSlice.reducer