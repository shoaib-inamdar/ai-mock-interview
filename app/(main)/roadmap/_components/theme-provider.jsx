'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ,
} from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
