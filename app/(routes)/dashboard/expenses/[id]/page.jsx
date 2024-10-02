"use client";
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses as ExpensesSchema } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { PenBox, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';


function Expenses({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expensesList, setExpensesList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchBudgetInfo = async () => {
            if (user && params.id) {
                setLoading(true);
                await getBudgetInfo();
                setLoading(false);
            }
        };
        fetchBudgetInfo();
    }, [user, params]);

    /*
    * Get Budget Information
    */

    const getBudgetInfo = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`SUM(CAST(${ExpensesSchema.amount} AS NUMERIC))`.mapWith(Number),
                totalItem: sql`COUNT(${ExpensesSchema.id})`.mapWith(Number),
            })
                .from(Budgets)
                .leftJoin(ExpensesSchema, eq(Budgets.id, ExpensesSchema.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .where(eq(Budgets.id, params.id))
                .groupBy(Budgets.id);

            if (result.length > 0) {
                setBudgetInfo(result[0]); // Assuming you want the first matched budget
            } else {
                console.warn("No budget found for the given ID.");
                setBudgetInfo(null);
            }
        } catch (error) {
            console.error("Error fetching budget info:", error);
        }
        getExpenseList();
    };

    /*
    * Get Latest Expenses
    */
    const getExpenseList = async () => {
        try {
            const result = await db.select().from(ExpensesSchema)
                .where(eq(ExpensesSchema.budgetId, params.id))
                .orderBy(desc(ExpensesSchema.id));
            setExpensesList(result);
            console.log(result);
        } catch (error) {
            console.error("Error in fetching Expense List: ", error)
        }
    }

    /*
    *Used to Delete a budget
    */

    const deleteBudget = async () => {
        const deleteExpenseResult = await db.delete(ExpensesSchema)
            .where(eq(ExpensesSchema.budgetId, params.id))
            .returning()

        if (deleteExpenseResult) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, params.id))
                .returning();

            console.log(result);
        }
        toast('Budget Deleted !');
        router.replace('/dashboard/budgets');
    }


    if (loading) {
        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                    <div key={index} className='w-full bg-slate-300 rounded-lg h-[150px] animate-pulse'></div>
                ))}
            </div>
        );
    }

    return (

        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between'>My Expenses
                <span className='flex gap-2 items-center'>
                    <EditBudget 
                    budgetInfo={budgetInfo}
                    refreshData={()=>getBudgetInfo()}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex gap-2" variant="destructive"><Trash />Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your current budget along with expenses
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </span>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                <BudgetItem
                    budget={budgetInfo}
                />
                <AddExpense budgetId={params.id}
                    user={user}
                    refreshData={() => getBudgetInfo()}
                />
            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-lg'>Latest Expense</h2>
                <ExpenseListTable expensesList={expensesList}
                    refreshData={() => getBudgetInfo()} />
            </div>
        </div>


    );
}

export default Expenses;
