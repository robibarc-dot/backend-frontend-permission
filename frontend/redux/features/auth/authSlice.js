import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        usersAuthLogin: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
        }),
        usersAuthRegister: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data,
            }),
        }),
        usersAuthLogout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
        usersAuthRefreshToken: builder.mutation({
            query: () => ({
                url: "/refresh",
                method: "POST",
            }),
        }),
        getMe: builder.query({
            query: () => ({
                url: "/user",
                method: "GET",
            }),
            providesTags: ["User"],
        }),
    }),
});

const getStoredToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

const clearStoredToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
};

const persistToken = (token) => {
    if (typeof window !== "undefined" && token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; SameSite=Lax`;
    }
};

const initialState = {
    token: getStoredToken(),
    user: null,
    roles: [],
    permissions: [],
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const loginResponse = await dispatch(
                authApi.endpoints.usersAuthLogin.initiate(credentials)
            ).unwrap();

            const token = loginResponse?.token;
            persistToken(token);

            const userResponse = await dispatch(
                authApi.endpoints.getMe.initiate(undefined, {
                    forceRefetch: true,
                })
            ).unwrap();

            return {
                ...loginResponse,
                token,
                user: userResponse,
            };
        } catch (error) {
            clearStoredToken();
            return rejectWithValue(
                error?.data || { message: "Login failed" }
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const registerResponse = await dispatch(
                authApi.endpoints.usersAuthRegister.initiate(payload)
            ).unwrap();

            const token = registerResponse?.token;
            persistToken(token);

            const userResponse = await dispatch(
                authApi.endpoints.getMe.initiate(undefined, {
                    forceRefetch: true,
                })
            ).unwrap();

            return {
                ...registerResponse,
                token,
                user: userResponse,
            };
        } catch (error) {
            clearStoredToken();
            return rejectWithValue(
                error?.data || { message: "Registration failed" }
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { dispatch }) => {
        try {
            await dispatch(
                authApi.endpoints.usersAuthLogout.initiate()
            ).unwrap();
        } finally {
            clearStoredToken();
            dispatch(apiSlice.util.resetApiState());
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload || {};

            if (token) {
                state.token = token;
                persistToken(token);
            }

            if (user) {
                state.user = user;
                state.roles = user.roles || [];
                state.permissions = user.permissions || [];
            }
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            state.roles = [];
            state.permissions = [];
            state.error = null;
            clearStoredToken();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const user = action.payload?.user || null;

                state.loading = false;
                state.token = action.payload?.token || null;
                state.user = user;
                state.roles = user?.roles || [];
                state.permissions = user?.permissions || [];
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.roles = [];
                state.permissions = [];
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const user = action.payload?.user || null;

                state.loading = false;
                state.token = action.payload?.token || null;
                state.user = user;
                state.roles = user?.roles || [];
                state.permissions = user?.permissions || [];
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.roles = [];
                state.permissions = [];
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Registration failed";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.roles = [];
                state.permissions = [];
                state.loading = false;
                state.error = null;
            })
            .addMatcher(
                authApi.endpoints.getMe.matchFulfilled,
                (state, action) => {
                    const user = action.payload || null;

                    state.user = user;
                    state.roles = user?.roles || [];
                    state.permissions = user?.permissions || [];
                }
            );
    },
});

export const { setCredentials, clearAuth } = authSlice.actions;

export const {
    useUsersAuthLoginMutation,
    useUsersAuthRegisterMutation,
    useUsersAuthLogoutMutation,
    useUsersAuthRefreshTokenMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
} = authApi;

export default authSlice.reducer;
