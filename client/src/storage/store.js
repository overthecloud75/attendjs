import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import themeReducer from './themeSlice'

export default configureStore({
    reducer: {
        user: userSlice,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})