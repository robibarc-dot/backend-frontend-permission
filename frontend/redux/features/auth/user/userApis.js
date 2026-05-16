import { apiSlice } from '@/redux/apiSlice';

/**
 * RTK Query API slice for User management.
 * Maps to the Laravel backend routes defined in UserController.
 */
export const userApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsersMeta: builder.query({
            query: () => '/backend/users/meta',
        }),

        getUsers: builder.query({
            query: (search) => ({
                url: '/backend/users',
                params: search ? { search } : {},
            }),
            providesTags: (result) =>
                result?.users
                    ? [
                        ...result.users.map(({ id }) => ({ type: 'User', id })),
                        { type: 'User', id: 'LIST' },
                      ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        getUser: builder.query({
            query: (id) => `/backend/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        createUser: builder.mutation({
            query: (body) => ({
                url: '/backend/users',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `/backend/users/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUsersMetaQuery,
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
} = userApis;