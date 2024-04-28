import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5173" }), // baseUrl doit être une chaîne de caractères
  reducerPath: "adminApi",
  tagTypes: ["User,Users", "Jobs", "Admins", "Dashboard"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `/api/v1/admin/user/${id}`,
      providesTags: ["User"],
    }),

    getUsers: build.query({
      query: () => "/api/v1/admin/users",
      providesTags: ["Users"],
    }),

    getAdmins: build.query({
      query: () => "/api/v1/admin/admins",
      providesTags: ["Admins"],
    }),
    getJob: build.query({
      query: (id) => `/api/v1/admin/jobs/${id}`, // Ajout du slash manquant
      providesTags: ["Jobs"],
    }),
    getDashboard: build.query({
      query: () => "/api/v1/admin/dashboard", // Correction du chemin de l'API
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetAdminsQuery,
  useGetJobQuery,
  useGetDashboardQuery,
} = api;
