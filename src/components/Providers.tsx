"use client"
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type Props = {children:React.ReactNode}

const queryclient = new QueryClient()

const Providers = (props: Props) => {
  return (
    <QueryClientProvider client={queryclient}>{props.children}</QueryClientProvider>
  )
}

export default Providers