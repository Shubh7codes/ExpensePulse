import { index } from 'drizzle-orm/mysql-core';
import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList }) {

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    calculateInfo();
    setIsLoading(false);
  }, [budgetList])

  const calculateInfo = () => {
    let spendSum = 0;
    let budgetSum = 0;
    budgetList.map((budget) => {
      console.log(budget.totalSpend); // Should give you the numeric value directly
      spendSum += budget.totalSpend;
      console.log(Number(budget.amount));  // Should give you the numeric value directly
      budgetSum += Number(budget.amount);
    });
    setTotalBudget(budgetSum);
    setTotalSpend(spendSum);
    console.log('Total Spend: ', spendSum, ' Total Budget: ', budgetSum)
  }
  return (
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {isLoading ? (
        [1, 2, 3, 4, 5, 6].map((item, index) => ( 
          <div key={index} className='w-full bg-slate-300 rounded-lg h-[120px] animate-pulse'></div>
        ))
      ) : (
        <>
          <div className='p-7 border rounded-lg flex items-center justify-between shadow-lg'>
            <div>
              <h2 className='text-sm'>Total Budget</h2>
              <h2 className='font-bold text-2xl'>₹{totalBudget}</h2>
            </div>
            <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
          </div>

          <div className='p-7 border rounded-lg flex items-center justify-between shadow-lg'>
            <div>
              <h2 className='text-sm'>Total Spend</h2>
              <h2 className='font-bold text-2xl'>₹{totalSpend}</h2>
            </div>
            <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
          </div>

          <div className='p-7 border rounded-lg flex items-center justify-between shadow-lg'>
            <div>
              <h2 className='text-sm'>No of Budget</h2>
              <h2 className='font-bold text-2xl'>{budgetList?.length}</h2>
            </div>
            <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
          </div>
        </>
      )}

    </div>
  )
}

export default CardInfo