'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import navItems from '../config/nav'

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">Music Tools</div>

        <button
          className="mobile-menu-button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span className="hamburger" />
        </button>

        <nav>
          <ul className={`nav-list${isOpen ? ' open' : ''}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`nav-link${isActive ? ' active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
