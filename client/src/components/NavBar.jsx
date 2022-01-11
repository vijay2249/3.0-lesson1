import {HiMenuAlt4} from 'react-icons/hi'
import {AiOutlineClose} from 'react-icons/ai'
import { useState } from 'react';

import logo from '../../images/logo.png';

const NavBarItem = ({title, classProp}) =>{
  return (
    <li className={`mx-4 cursor-pointer ${classProp}`}> {title} </li>
  );
}

const NavBar = () =>{
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex[0:5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className='w-32 cursor-pointer' />
      </div>
      <ul className='text-white md:flex hidden list-none flex-row justify-between items-center flex-initial' >
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) =>(
          <NavBarItem key={item+index} title={item} />
        ))}
        <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>
          Login
        </li>
      </ul>
      <div className='flex relative'>
        {
          toggleMenu 
          ? <AiOutlineClose fontSize={28} className='text-whitemd:hidden cursor-pointer' onClick={()=>setToggleMenu(false)} /> 
          : <HiMenuAlt4 fontSize={28} className='text-whitemd:hidden cursor-pointer' onClick={()=>setToggleMenu(true)} /> 
        }
        {toggleMenu &&(
          <ul>
            <li className='text-xl w-full my-2'>
              <AiOutlineClose onClick={()=>setToggleMenu(false)}/>
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) =>(
              <NavBarItem key={item+index} title={item} classProp="my-2 text-lg" />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default NavBar;