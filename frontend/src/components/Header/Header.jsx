import React from 'react'
import './header.css'
import { useState } from 'react'
import HeaderLeft from './HeaderLeft'
import Navbar from './Navbar'
import HeaderRight from './HeaderRight'

function Header() {

    const [toggle, settoggle] = useState(false)

return (
    <header className="header">
        <HeaderLeft toggle={toggle} settoggle={settoggle}/>
        <Navbar toggle={toggle} settoggle={settoggle}/>
        <HeaderRight/>
    </header>
)
}

export default Header