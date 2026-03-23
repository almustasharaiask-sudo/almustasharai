import './globals.css'

export const metadata = {
  title: 'Almustashar AI',
  description: 'AI Learning Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}