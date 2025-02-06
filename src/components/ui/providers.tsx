"use client"

import * as React from "react"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const ReactQueryClientProvider: React.FC<{ children: React.ReactNode; }> = ({children}) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
);
