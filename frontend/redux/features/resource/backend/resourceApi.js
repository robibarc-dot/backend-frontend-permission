import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const resourceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getResources: builder.query({
            query: (params) => ({
                url: 'resource',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Resource', id })),
                        { type: 'Resource', id: 'LIST' },
                      ]
                    : [{ type: 'Resource', id: 'LIST' }],
        }),

        getResource: builder.query({
            query: (id) => `resource/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'Resource', id }],
        }),

        createResource: builder.mutation({
            query: (body) => ({
                url: 'resource/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'Resource', id: 'LIST' }],
        }),

        updateResource: builder.mutation({
            query: ({ id, body }) => ({
                url: `resource/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'Resource', id },
                { type: 'Resource', id: 'LIST' },
            ],
        }),

        deleteResource: builder.mutation({
            query: (id) => ({
                url: `resource/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Resource', id },
                { type: 'Resource', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetResourcesQuery,
    useGetResourceQuery,
    useCreateResourceMutation,
    useUpdateResourceMutation,
    useDeleteResourceMutation,
} = resourceApi;