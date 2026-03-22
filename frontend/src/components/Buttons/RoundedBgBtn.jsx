import Link from 'next/link'
import React from 'react'

const RoundedBgBtn = ({label, link="#"}) => {
  return (
      <Link data-aos="fade-up" href={link}  className="px-6 text-center  py-3 text-lg font-medium text-white bg-[var(--primary1)] m-0 rounded-[50px] cursor-pointer shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                {label ?? " "}
              </Link>
  )
}

export default RoundedBgBtn