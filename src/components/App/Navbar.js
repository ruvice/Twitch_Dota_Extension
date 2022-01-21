import React from 'react'
import './Navbar.css'

const Navbar = (props) => {
  const { toggleTab } = props
  return (
    <div className="navbar">
      <ul>
        <li onClick={() => toggleTab(true)}>
          <h1>Events</h1>
        </li>
        <li onClick={() => toggleTab(false)}>
          <h1>Vote</h1>
        </li>
      </ul>
    </div>
  )
};

export default Navbar;
