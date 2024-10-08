import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function ExpenseListTable({ expensesList, refreshData }) {
    
    const user = useUser();

    const deleteExpense = async (expense) => {
        try {
            const result = await db.delete(Expenses)
                .where(eq(Expenses.id, expense.id))
                .returning();
    
            if (result.length > 0) {
                toast('Expense Deleted');
                refreshData();
            } else {
                toast.error('Failed to delete the expense.');
            }
        } catch (error) {
            toast.error('Error occurred while deleting the expense.');
            console.error(error);
        }
    };
    return (
        <div className='mt-3'>
            <div className='grid grid-cols-4 bg-slate-200 p-2'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expensesList.map((expense, index) => (
                <div key={index} className='grid grid-cols-4 bg-slate-200 p-2'>
                    <h2>{expense.name}</h2>
                    <h2>{expense.amount}</h2>
                    <h2>{expense.createdAt}</h2>
                    <h2>
                        <Trash className='text-red-600 cursor-pointer'
                            onClick={() => deleteExpense(expense)}
                        />
                    </h2>
                </div>
            ))}
        </div>
    )
}

export default ExpenseListTable