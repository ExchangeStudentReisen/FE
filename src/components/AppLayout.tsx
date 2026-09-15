import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-107.5 bg-[#f5fafe]">
      <Outlet />
    </div>
  )
}
