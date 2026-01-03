import type React from 'react'
import type { Metadata } from 'next'
import { Poppins, Nunito_Sans } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800'],
  variable: '--font-poppins',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Γυμναστική Καλλιτεχνία Κεφαλονιάς',
  description: 'Σύλλογος Γυμναστικής Καλλιτεχνίας στην Κεφαλονιά',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="el" data-scroll-behavior="smooth">
      <body className={`${nunitoSans.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

