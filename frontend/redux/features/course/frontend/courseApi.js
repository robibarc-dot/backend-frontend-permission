import { apiSlice } from "../../../apiSlice";

const unwrapData = (response) => response?.data ?? response;

export const frontendCourseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFrontendCourses: builder.query({
            query: (params) => ({
                url: "frontend/courses",
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) => {
                const courses = Array.isArray(result?.data)
                    ? result.data
                    : result?.data?.data || [];

                return courses.length
                    ? [
                        ...courses.map(({ id }) => ({ type: "Course", id })),
                        { type: "Course", id: "LIST" },
                    ]
                    : [{ type: "Course", id: "LIST" }];
            },
        }),

        getFrontendCourse: builder.query({
            query: (identifier) => `frontend/courses/${identifier}`,
            transformResponse: unwrapData,
            providesTags: (result, error, identifier) => [
                { type: "Course", id: result?.id || identifier },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetFrontendCoursesQuery,
    useGetFrontendCourseQuery,
} = frontendCourseApi;
