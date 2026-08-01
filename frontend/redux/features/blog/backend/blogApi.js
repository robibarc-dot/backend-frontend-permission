import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const blogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: (params) => ({
                url: 'blog',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Blog', id })),
                        { type: 'Blog', id: 'LIST' },
                    ]
                    : [{ type: 'Blog', id: 'LIST' }],
        }),

        getBlog: builder.query({
            query: (id) => `blog/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'Blog', id }],
        }),

        createBlog: builder.mutation({
            query: (formData) => ({
                url: 'blog/store',
                method: 'POST',
                body: formData,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
        }),

        updateBlog: builder.mutation({
            query: ({ id, body }) => ({
                url: `blog/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'Blog', id },
                { type: 'Blog', id: 'LIST' },
            ],
        }),

        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `blog/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Blog', id },
                { type: 'Blog', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetBlogsQuery,
    useGetBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;