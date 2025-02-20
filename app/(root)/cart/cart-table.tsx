'use client';

import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition, useState } from "react"; // أضف useState
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Plus, Minus, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null); // حالة لتتبع المنتج الذي يتم التعديل عليه

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty. <Link href='/'>Go Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link href={`/product/${item.slug}`} className="flex items-center">
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className='flex-center gap-2'>
                                            <Button
                                                disabled={isPending && loadingProductId === item.productId} // تعطيل الزر فقط إذا كان هذا المنتج هو الذي يتم التعديل عليه
                                                variant='outline'
                                                type='button'
                                                onClick={() => {
                                                    setLoadingProductId(item.productId); // تعيين معرف المنتج الذي يتم التعديل عليه
                                                    startTransition(async () => {
                                                        const res = await removeItemFromCart(item.productId);
                                                        if (!res.success) {
                                                            toast({
                                                                variant: 'destructive',
                                                                description: res.message,
                                                            });
                                                        }
                                                        setLoadingProductId(null); // إعادة تعيين الحالة بعد الانتهاء
                                                    });
                                                }}
                                            >
                                                {isPending && loadingProductId === item.productId ? ( // عرض Loader فقط إذا كان هذا المنتج هو الذي يتم التعديل عليه
                                                    <Loader className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <Minus className='w-4 h-4' />
                                                )}
                                            </Button>
                                            <span>{item.qty}</span>
                                            <Button
                                                disabled={isPending && loadingProductId === item.productId} // تعطيل الزر فقط إذا كان هذا المنتج هو الذي يتم التعديل عليه
                                                variant='outline'
                                                type='button'
                                                onClick={() => {
                                                    setLoadingProductId(item.productId); // تعيين معرف المنتج الذي يتم التعديل عليه
                                                    startTransition(async () => {
                                                        const res = await addItemToCart(item);
                                                        if (!res.success) {
                                                            toast({
                                                                variant: 'destructive',
                                                                description: res.message,
                                                            });
                                                        }
                                                        setLoadingProductId(null); // إعادة تعيين الحالة بعد الانتهاء
                                                    });
                                                }}
                                            >
                                                {isPending && loadingProductId === item.productId ? ( // عرض Loader فقط إذا كان هذا المنتج هو الذي يتم التعديل عليه
                                                    <Loader className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <Plus className='w-4 h-4' />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">${item.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartTable;