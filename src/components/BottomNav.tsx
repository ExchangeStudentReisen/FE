import { NavLink } from 'react-router-dom'
import { Home, Plus, User } from 'lucide-react'

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 text-xs ${
    isActive ? 'text-primary' : 'text-slate-400'
  }`

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-120 border-t border-slate-200 bg-white">
      <div className="flex items-center justify-around py-2 px-12">
        <NavLink to="/feed" className={navItemClass}>
          <Home size={22} />
          홈
        </NavLink>
        
        <NavLink
          to="/post/new"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white -mt-4 shadow-md"
        >
          <Plus size={22} />
        </NavLink>
        
        <NavLink to="/profile" className={navItemClass}>
          <User size={22} />
          나
        </NavLink>
      </div>
    </nav>
  )
}