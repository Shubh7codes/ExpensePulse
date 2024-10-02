import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashBoardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
            <h2 className='font-bold text-lg'>Expense Pulse</h2>
        </div>
        <div>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashBoardHeader