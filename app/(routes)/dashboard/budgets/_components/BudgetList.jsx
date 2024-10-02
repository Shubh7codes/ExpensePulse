"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

    const [budgetList, setBudgetList] = useState([]);

    const { user } = useUser();

    useEffect(() => {
        getBudgetList();
    }, [user])

    // Used to get budget list
    const getBudgetList = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
            totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));

        setBudgetList(result);
    }
    budgetList.map((budget) => {
        console.log(budget.totalSpend); // Should give you the numeric value directly
        console.log(budget.totalItem);  // Should give you the numeric value directly
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await getBudgetList();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className='mt-7'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <CreateBudget refreshData={() => getBudgetList()} />
                {isLoading ? (
                    [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className='w-full bg-slate-300 rounded-lg h-[150px] animate-pulse'></div>
                    ))
                ) : (
                    budgetList?.length > 0 ? budgetList.map((budget, index) => (
                        <BudgetItem budget={budget} key={index} />
                    )) : null
                )}
            </div>
        </div>
    );
}

export default BudgetList