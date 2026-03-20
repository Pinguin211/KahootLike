import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../../context/SidebarContext'
import { TestsInfoProvider } from '../../context/TestsInfoContext'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <SidebarProvider>
      <TestsInfoProvider>
        <div className="flex flex-col min-h-dvh bg-gray-950 text-white">
          <Header />
          <Sidebar />
          <main className="flex-1 pt-15 w-full">
            <Outlet />
          </main>
        </div>
      </TestsInfoProvider>
    </SidebarProvider>
  )
}

