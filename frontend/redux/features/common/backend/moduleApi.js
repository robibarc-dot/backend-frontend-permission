import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const moduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getModules: builder.query({
            query: (params) => ({
                url: 'module',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Module', id })),
                        { type: 'Module', id: 'LIST' },
                      ]
                    : [{ type: 'Module', id: 'LIST' }],
        }),

        getModuleCreateMetadata: builder.query({
            query: () => 'module/create',
            transformResponse: unwrapData,
        }),

        getModule: builder.query({
            query: (id) => `module/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'Module', id }],
        }),

        createModule: builder.mutation({
            query: (body) => ({
                url: 'module/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'Module', id: 'LIST' }],
        }),

        updateModule: builder.mutation({
            query: ({ id, body }) => ({
                url: `module/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'Module', id },
                { type: 'Module', id: 'LIST' },
            ],
        }),

        deleteModule: builder.mutation({
            query: (id) => ({
                url: `module/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Module', id },
                { type: 'Module', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetModulesQuery,
    useGetModuleCreateMetadataQuery,
    useGetModuleQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
} = moduleApi;