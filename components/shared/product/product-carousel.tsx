'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from 'embla-carousel-autoplay'
import Image from "next/image";
import Link from "next/link";
const ProductCarousel =  ({data}:{data:Product[]} ) => {
    return (<Carousel className="w-full mb-12" opts={{
        loop:true
    }} plugins={[Autoplay({
        delay:2000,
        stopOnInteraction:false,
        stopOnMouseEnter:true
    })]}> 
            <CarouselContent>
            {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
            <div className="relative mx-auto h-96"> {/* ارتفاع ثابت للـ Banner */}
                <Image
                  alt={product.name}
                  src={product.banner!}
                  fill // استخدام fill لجعل الصورة تأخذ الحجم الكامل للعنصر الأب
                  className="object-cover" // لجعل الصورة تتناسب مع الحجم المحدد دون تشويه
                />
                <div className='absolute inset-0 flex items-end justify-center'>
                  <h2 className=' bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white  '>
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>  );
}
 
export default ProductCarousel;