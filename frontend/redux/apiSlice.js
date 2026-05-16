import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",

    prepareHeaders: (headers) => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        headers.set("accept", "application/json");

        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: [
        "User",
        "PracticeTest"
    ],
    endpoints: () => ({}),
});