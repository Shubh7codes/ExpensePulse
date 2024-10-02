"use client"
import { Budgets, Expenses as ExpensesSchema } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable';


function Expenses() {

  const {user} = useUser();
  const [expensesList, setExpensesList] = useState([]);

  useEffect(()=>{
    if(user){
      getAllExpenses();
    }
  },[user])

  const getAllExpenses = async () => {
    const result = await db.select({
      id: ExpensesSchema.id,
      name: ExpensesSchema.name,
      amount: ExpensesSchema.amount,
      createdAt: ExpensesSchema.createdAt
    }).from(Budgets)
      .rightJoin(ExpensesSchema, eq(Budgets.id, ExpensesSchema.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(ExpensesSchema.id));
    setExpensesList(result);
    console.log("All the Expenses: ", result);
  }
  return (
    <div>
      <ExpenseListTable
      expensesList={expensesList}
      />
    </div>
  )
}

export default Expenses