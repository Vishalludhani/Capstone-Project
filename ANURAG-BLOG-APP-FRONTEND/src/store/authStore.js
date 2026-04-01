import { create } from 'zustand'
import axios from 'axios'

export const useAuth = create((set) => ({
    //we need to know the current user i.e. the person who is logged in
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    articles: [],
    setArticles: (data) => set({ articles: data }),

    login: async (userCredWithRole) => {
        const { role, ...userCred } = userCredWithRole
        try {
            //set loading state
            //make api request
            //update state
            set({ loading: true, error: null })

            let resObj = await axios.post("http://localhost:6767/common-api/login", userCred, { withCredentials: true })

            set({ loading: false, error: null, isAuthenticated: true, currentUser: resObj.data.payload })
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err.response?.data?.error || "Login Failed"
            })
        }
    },
    logout: async () => {
        try {
            //set loading state
            //make api request
            //update state
            set({ loading: true, error: null })

            let resObj = await axios.get("http://localhost:6767/common-api/logout", { withCredentials: true })

            set({ loading: false, isAuthenticated: false, currentUser: null })
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err.response?.data?.error || "Logout Failed"
            })
        }
    },
    refresh: async () => {
        try {
            set({ loading: true })

            let resObj = await axios.get("http://localhost:6767/common-api/check-auth", { withCredentials: true })

            set({ loading: false, isAuthenticated: true, currentUser: resObj.data.payload })
        } catch (err) {
            if (err.response?.status === 401) {
                set({
                    loading: false,
                    isAuthenticated: false,
                    currentUser: null,
                })
                return
            }

            console.error("Authentication failed",err)
            set({loading:false})
        }
    },

}))

