import { useState, useEffect } from 'react'

import './Navbar.scss'

const Navbar = () => {
  const [hasBg, setHasBg] = useState(false)
  const handleScroll = () => {
    document.addEventListener('scroll', () => {
      const y = window.scrollY
      const breakpoint = 120
      if (y > breakpoint) setHasBg(true)
      else setHasBg(false)
    })
  }
  useEffect(handleScroll, [])
  return (
    <nav className={hasBg ? 'has-bg' : ''}>
      <div className="container">
        <div className="nav-inner">
          <div className="nav-brand">
            El<span>B</span>
          </div>
          <ul className="main-menu">
            <li className="active">
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#technologies">Technologies</a>
            </li>
            <li>
              <a href="#portfolio">Portfolio</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
