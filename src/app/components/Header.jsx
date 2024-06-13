import React from 'react'
import '../../app/styles/index.scss';

const Header = ({ buttonText, handleClick }) => {
  return (
    <div className='react-flow-header'>
         <button className='save-button' onClick={handleClick}>
            {buttonText}
         </button>
    </div>
  )
}

export default Header