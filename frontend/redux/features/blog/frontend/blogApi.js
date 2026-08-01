import { apiSlice } from "../../../apiSlice";

const unwrapData = (response) => response?.data ?? response;

export const frontendBlogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Fetch a list of active blogs with optional module filtering.
         * GET frontend/blogs
         */
        getFrontendBlogs: builder.query({
            query: (params) => ({
                url: "frontend/blogs",
                params,
            }),
            transformResponse: unwrapData,
            providesTags: (result) => {
                const blogs = Array.isArray(result?.data)
                    ? result.data
                    : result?.data?.data || [];

                return blogs.length
                    ? [
                        ...blogs.map(({ id }) => ({ type: "Blog", id })),
                        { type: "Blog", id: "LIST" },
                    ]
                    : [{ type: "Blog", id: "LIST" }];
            },
        }),

        /**
         * Fetch a single blog by ID with its sections.
         * GET frontend/blogs/{id}
         */
        getFrontendBlog: builder.query({
            query: (id) => `frontend/blogs/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: "Blog", id }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetFrontendBlogsQuery,
    useGetFrontendBlogQuery,
} = frontendBlogApi;