import { z } from "zod";
import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, shippingAddressSchema,paymentResultSchema, insertReviewSchema } from "@/lib/validators";

export type Product=z.infer<typeof insertProductSchema>&{
    id:string;
    rating:string;
 
    createdAt:Date; 
}
export type Cart=z.infer<typeof insertCartSchema>
export type CartItem=z.infer<typeof cartItemSchema>
export type ShippingAddress=z.infer<typeof shippingAddressSchema>
export type Order=z.infer<typeof insertOrderSchema>
export type OrderItem=z.infer<typeof insertOrderItemSchema>&{
    id:string;
    createdAt:Date;
    isPaid: boolean;
    paidAt:Date| null;
    isDelivered: boolean;
    deliveredAt:Date|null;
    orderitems:OrderItem[];
    user:{name:string,email:string}
}//هدول الحقلين مشان يتم اضافتن بالجدول بالداتابيز تلقائيا و ما الن علاقة بالفورم

export type PaymentResult=z.infer<typeof paymentResultSchema>;


export type Review = z.infer<typeof insertReviewSchema> & {
    id: string;
    createdAt: Date;
    numReviews:number;
    user?: { name: string };
  };