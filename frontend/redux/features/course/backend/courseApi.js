import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: (params) => ({
                url: 'course',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Course', id })),
                        { type: 'Course', id: 'LIST' },
                      ]
                    : [{ type: 'Course', id: 'LIST' }],
        }),

        getCourseCreateMetadata: builder.query({
            query: () => 'course/create',
            transformResponse: unwrapData,
        }),

        getCourse: builder.query({
            query: (id) => `course/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'Course', id }],
        }),

        createCourse: builder.mutation({
            query: (body) => ({
                url: 'course/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'Course', id: 'LIST' }],
        }),

        updateCourse: builder.mutation({
            query: ({ id, body }) => ({
                url: `course/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'Course', id },
                { type: 'Course', id: 'LIST' },
            ],
        }),

        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `course/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Course', id },
                { type: 'Course', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCoursesQuery,
    useGetCourseCreateMetadataQuery,
    useGetCourseQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseApi;
