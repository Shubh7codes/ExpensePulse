import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashBoardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
            Search Bar
        </div>
        <div>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashBoardHeader