

'use client';

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage }  from "@/components/ui/form"
import { Input } from "../ui/input";  
import { Button } from "../ui/button";  
import slugify from 'slugify';
import { Textarea } from "../ui/textarea";  
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";  

const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: type === 'Update' ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
        defaultValues: product && type === 'Update' ? product : productDefaultValues,
    });

// Handle form submit
const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
  values
) => {
  
  if (type === 'Create') {
    const res = await createProduct(values);

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });
      router.push(`/admin/products`);
    }
  }
  if (type === 'Update') {
    if (!productId) {
      router.push(`/admin/products`);
      return;
    }

    const res = await updateProduct({ ...values, id: productId });

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });
      router.push(`/admin/products`);
    }
  }
};
const images=form.watch('images')|| [];
const isFeatured=form.watch('isFeatured');
const banner=form.watch('banner');

const handleRemoveImage = (imageToRemove: string) => {
  const updatedImages = images.filter((image: string) => image !== imageToRemove);
  form.setValue('images', updatedImages);
};

const handleRemoveBanner = () => {
  form.setValue('banner', '');
};
    return (
        <Form {...form} >
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Slug */}
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                  <div className="relative">

                                    <Input placeholder="Enter slug" {...field} />
                                    <Button
                                            type='button'
                                            className='bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600'
                                            onClick={() => {
                                              form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                                            }}
                                          >
                                            Generate
                                          </Button>
                                            </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                     {/* Category */}
  <FormField
    control={form.control}
    name='category'
    render={({
      field})=>      (<FormItem className='w-full'>
        <FormLabel>Category</FormLabel>
        <FormControl>
          <Input placeholder='Enter category' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  {/* Brand */}
  <FormField
    control={form.control}
    name='brand'
    render={({
      field}) => (
      <FormItem className='w-full'>
        <FormLabel>Brand</FormLabel>
        <FormControl>
          <Input placeholder='Enter product brand' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Price */}
  <FormField
    control={form.control}
    name='price'
    render={({
      field }) => (
      <FormItem className='w-full'>
        <FormLabel>Price</FormLabel>
        <FormControl>
          <Input placeholder='Enter product price' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
                    
  {/* Stock */}
  <FormField
    control={form.control}
    name='stock'
    render={({
      field}) => (
      <FormItem className='w-full'>
        <FormLabel>Stock</FormLabel>
        <FormControl>
          <Input type='number' placeholder='Enter product stock' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
                    {/* Images
    <FormField
    control={form.control}
    name='images'
    render={() => (
    <FormItem className='w-full'>
      <FormLabel>Images</FormLabel>
      <Card>
        <CardContent className='space-y-2 mt-2 min-h-48'>
          <div className='flex-start space-x-2'>
          {images && images.filter((image: string) => image).map((image: string) => (
  <Image
    key={image}
    src={image } 
    alt='product image'
    className='w-20 h-20 object-cover object-center rounded-sm'
    width={100}
    height={100}
  />
))}
            <FormControl>
            <UploadButton
  endpoint='imageUploader'
  onClientUploadComplete={(res: { url: string }[]) => {
    if (res && res.length > 0 && res[0].url) {
      form.setValue('images', [...images, res[0].url]);
    }
  }}
  onUploadError={(error: Error) => {
    toast({
      variant: 'destructive',
      description: `ERROR! ${error.message}`,
    });
  }}
/>
            </FormControl>
          </div>
        </CardContent>
      </Card>
      <FormMessage />
    </FormItem>
  )}
/>
                </div>

                <div className='upload-field'>
  Featured Product
  <Card>
    <CardContent className='space-y-2 mt-2  '>
      <FormField
        control={form.control}
        name='isFeatured'
        render={({ field }) => (
          <FormItem className='space-x-2 items-center'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Is Featured?</FormLabel>
          </FormItem>
        )}
      />
      {isFeatured && banner && (
        <Image
          src={banner}
          alt='banner image'
          className=' w-full object-cover object-center rounded-sm'
          width={1920}
          height={680}
        />
      )}
      {isFeatured && !banner && (
        <UploadButton
          endpoint='imageUploader'
          onClientUploadComplete={(res: { url: string }[]) => {
            form.setValue('banner', res[0].url);
          }}
          onUploadError={(error: Error) => {
            toast({
              variant: 'destructive',
              description: `ERROR! ${error.message}`,
            });
          }}
        />
      )}
    </CardContent>
  </Card>*/}
 <div className='upload-field flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name='images'
                        render={() => (
                            <FormItem className='w-full'>
                                <FormLabel>Images</FormLabel>
                                <Card>
                                    <CardContent className='space-y-2 mt-2 min-h-48'>
                                        <div className='flex-start space-x-2'>
                                            {images && images.filter((image: string) => image).map((image: string) => (
                                                <div key={image} className="relative">
                                                    <Image
                                                        src={image}
                                                        alt='product image'
                                                        className='w-20 h-20 object-cover object-center rounded-sm'
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(image)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                            <FormControl>
                                                <UploadButton
                                                    endpoint='imageUploader'
                                                    onClientUploadComplete={(res: { url: string }[]) => {
                                                        if (res && res.length > 0 && res[0].url) {
                                                            form.setValue('images', [...images, res[0].url]);
                                                        }
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast({
                                                            variant: 'destructive',
                                                            description: `ERROR! ${error.message}`,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='upload-field'>
                    Featured Product
                    <Card>
                        <CardContent className='space-y-2 mt-2'>
                            <FormField
                                control={form.control}
                                name='isFeatured'
                                render={({ field }) => (
                                    <FormItem className='space-x-2 items-center'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Featured?</FormLabel>
                                    </FormItem>
                                )}
                            />
                            {isFeatured && banner && (
                                <div className="relative">
                                    <Image
                                        src={banner}
                                        alt='banner image'
                                        className='w-full object-cover object-center rounded-sm'
                                        width={1920}
                                        height={680}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveBanner}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                            {isFeatured && !banner && (
                                <UploadButton
                                    endpoint='imageUploader'
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        form.setValue('banner', res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast({
                                            variant: 'destructive',
                                            description: `ERROR! ${error.message}`,
                                        });
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>


                
                <div>
                            {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({
              field 
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                </div>
                <div>{/* Submit */}
                  <Button type="submit" size='lg'disabled={form.formState.isSubmitting}className="button col-span-2 w-full">
                    {form.formState.isSubmitting?'Submitting...':`${type} Product`}
                  </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;
  