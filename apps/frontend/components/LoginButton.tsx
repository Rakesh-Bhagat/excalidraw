import React from 'react'

interface buttonProps{
    onclick: () => void;
    text: string
}
const LoginButton = ({ onclick , text}: buttonProps) => {
  return (
    <button onClick={onclick} className='cursor-pointer text-md px-4 py-2 bg-[#1d4ed8] text-white rounded-lg font-semibold'>{text}</button>
  )
}

export default LoginButton