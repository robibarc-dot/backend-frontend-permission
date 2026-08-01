import { apiSlice } from "../../../apiSlice";

const unwrapData = (response) => response?.data ?? response;

export const frontendResourceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Fetch a list of active resources with optional module filtering.
         * GET frontend/resources
         */
        getFrontendResources: builder.query({
            query: (params) => ({
                url: 'frontend/resources',
                params,
            }),
            transformResponse: unwrapData,
            providesTags: (result) => {
                const resources = Array.isArray(result?.data)
                    ? result.data
                    : result?.data?.data || [];

                return resources.length
                    ? [
                          ...resources.map(({ id }) => ({ type: 'Resource', id })),
                          { type: 'Resource', id: 'LIST' },
                      ]
                    : [{ type: 'Resource', id: 'LIST' }];
            },
        }),

        /**
         * Fetch a single resource by ID with its sections.
         * GET frontend/resources/{identifier}
         */
        getFrontendResource: builder.query({
            query: (identifier) => `frontend/resources/${identifier}`,
            transformResponse: unwrapData,
            providesTags: (result, error, identifier) => [{ type: 'Resource', id: identifier }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetFrontendResourcesQuery,
    useGetFrontendResourceQuery,
} = frontendResourceApi;