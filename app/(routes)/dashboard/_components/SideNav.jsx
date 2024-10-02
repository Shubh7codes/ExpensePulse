"use client"
import { UserButton } from '@clerk/nextjs';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

function SideNav() {

    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expenses'
        },
        {
            id: 4,
            name: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade'
        },

    ];
    const path = usePathname();
    const router = useRouter();

    const handleNavigation = (menuPath) => {
        router.push(menuPath);
    };

    useEffect(() => {
        console.log(path)
    }, [])

    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image src={'/logo.svg'}
                alt='logo'
                width={38}
                height={20}
            />
            <div>
                {menuList.map((menu, index) => (
                    <h2
                        key={menu.id}
                        onClick={() => handleNavigation(menu.path)}
                        className={`flex gap-2 items-center
                        text-gray-500 font-medium p-5
                        cursor-pointer rounded-md mb-2
                        hover: text-primary hover:bg-blue-100
                        ${path == menu.path && 'text-primary bg-blue-100'}
                    `}>
                        <menu.icon />
                        {menu.name}
                    </h2>
                ))}
            </div>
            <div className='fixed items-center bottom-10 p-5 flex gap-2'>
                <UserButton />
                Profile
            </div>
        </div>
    )
}

export default SideNav