"use client"

import { SWRConfig } from 'swr'
import apiClient from '@/lib/api-client';

interface SWRProviderProps {
    children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig 
        value={{
            fetcher: (url) => apiClient.get(url),
            onError: (error, key) => {
                console.error(`SWR Error for key ${key}:`, error);
            }
        }}
    >
      {children}
    </SWRConfig>
  )
} 