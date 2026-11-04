'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props} 
      defaultTheme="light" 
      forcedTheme="light" // Baris ini akan memaksa web selalu berwarna terang
    >
      {children}
    </NextThemesProvider>
  )
}