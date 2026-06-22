import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IPost } from "../../../../../services/app/src/models/Post.model"
import type { IAITokens } from "../../../../../services/app/src/models/AITokens.model"

interface TenantStoreState {
    posts: IPost[]
    usageTokens: {
        limit: number
        usedToday: number 
        history: IAITokens[]
    }
}

const initialState: TenantStoreState = {
    posts: [],
    usageTokens: {
        limit: 0,
        usedToday: 0,
        history: []
    }
}

const tenantStoreSlice = createSlice({
    name: 'tenantStore',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<{ posts: IPost[] }>) => {
            state.posts = action.payload.posts
        },
        setOrUpdateUsafeTokens: (state, action: PayloadAction<{ usageTokens: Partial<TenantStoreState['usageTokens']>}>) => {
            state.usageTokens = { ...state.usageTokens, ...action.payload.usageTokens }
        },
    }
})

export const { setOrUpdateUsafeTokens, setPosts, } = tenantStoreSlice.actions
export default tenantStoreSlice.reducer
