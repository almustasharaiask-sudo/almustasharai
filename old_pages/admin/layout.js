import AdminNavbar from '../../components/AdminNavbar'
import { AdminAuthProvider } from '../../lib/admin-auth-context'
import AdminProtect from '../../components/AdminProtect'

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminProtect>
        <div className="min-h-screen bg-gray-100">
          <AdminNavbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </AdminProtect>
    </AdminAuthProvider>
  )
}
