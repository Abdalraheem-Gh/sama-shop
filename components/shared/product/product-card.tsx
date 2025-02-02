import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({product}:{product:Product}) => {
    return (
    <Card className="w-full max-w-screen-sm">
        <CardHeader className="p-0 items-center ">
            <Link href={`/product/${product.slug}`}>
            <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true}/>
                </Link>
        </CardHeader>
        <CardContent className="grid p-4 gap-4">
            <div className="text-xs">{product.brand}</div>
            <Link href={`/produc/${product.slug}`}>
            <h2 className="h2 text-sm font-medium">{product.name }</h2>
            </Link>
            <div className="flex-between gap-4 ">
                <p>{product.rating} Stars</p>
                {product.stock>0?(<span className="font-bold"><ProductPrice value={Number(product.price)}  /></span>):(<p className="text-destructive">Out Of Stuck</p>)}
            </div>
        </CardContent>
    </Card> );
}

export default ProductCard;