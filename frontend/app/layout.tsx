import type { Metadata } from 'next'
import React from 'react'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'RoleRadar - Spot your next role in a heartbeat',
  description: 'Find your dream job with AI-powered semantic search. RoleRadar helps job seekers discover relevant opportunities using natural language.',
  keywords: 'job search, careers, AI, semantic search, job matching',
  icons: {
    icon: '/roleradar_logo3.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
