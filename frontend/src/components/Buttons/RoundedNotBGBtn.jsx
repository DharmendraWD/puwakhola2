import Link from 'next/link'
import React from 'react'

const RoundedNotBGBtn = ({label, link="#"}) => {
  return (
     <Link data-aos="fade-up" href={link} className="px-6 text-center py-3 text-lg font-medium text-[var(--primary1)] border border-blue-600 cursor-pointer rounded-[50px] shadow-md bg-white hover:bg-blue-50 transition duration-300 transform hover:scale-105">
               {label ?? " "}
              </Link>
  )
}

export default RoundedNotBGBtn