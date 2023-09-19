'use client'

import { FC, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

interface AuthContextProps {
  children: ReactNode
}

const AuthContext: FC<AuthContextProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthContext
