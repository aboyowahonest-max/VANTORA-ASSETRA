import './globals.css'
import { AppProvider } from '@/components/App'
export const metadata = { title: 'VANTORA', description: 'Virtual asset simulation (demo credits only)' }
export default function RootLayout({ children }) {
  return (<html lang="en"><body><AppProvider>{children}</AppProvider></body></html>)
}
