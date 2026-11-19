import type { Metadata, Viewport } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'TEApoia',
  description: 'Um espaço de apoio para o seu dia a dia.',
  applicationName: 'TEApoia',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'TEApoia' },
  icons: { icon: '/favicon.svg', apple: '/icons/teapoia-192.png' },
}

export const viewport: Viewport = {
  themeColor: '#edf3ff',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>
}
