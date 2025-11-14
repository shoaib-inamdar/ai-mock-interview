'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
 ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
