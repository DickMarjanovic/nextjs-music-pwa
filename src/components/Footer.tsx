'use client'

import Link from 'next/link'
import navItems from '../config/nav'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} className="footer-link">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="footer-copy">© {new Date().getFullYear()} Music Tools</div>
      </div>
    </footer>
  )
}
