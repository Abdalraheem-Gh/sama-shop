'use client';

import { Review } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./review-form-dialog";
import { getReviews } from "@/lib/actions/review.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";
import { useToast } from "@/hooks/use-toast";

const ReviewList = ({
    userId,
    productId,
    productSlug,
  }: {
    userId: string;
    productId: string;
    productSlug: string;
  }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const { toast } = useToast();
    useEffect(() => {
        const loadReviews = async () => {
          const res = await getReviews({ productId });
          setReviews(res.data);
        };
    
        loadReviews();
      }, [productId]);
// Reload reviews when a review is submitted
const reload = async () => {
    try {
      const res = await getReviews({ productId });
      setReviews([...res.data]);
    } catch (err) {
      console.log(err);
      toast({
        variant: 'destructive',
        description: 'Error in fetching reviews',
      });
    }
  };
    return (
      <div className='space-y-4'>
        {reviews.length === 0 && <div>No reviews yet</div>}
        {userId ? (
                    <ReviewForm onReviewSubmitted={reload} productId= {productId} userId= {userId} />

        ) : (
          <div>
            Please
            <Link
              className='text-blue-700 px-2'
              href={`/sign-in?callbackUrl=/product/${productSlug}`}
            >
              sign in
            </Link>
            to write a review
          </div>
        )}
        <div className='flex flex-col gap-3'>
            {/* REVIEWS HERE */}
            {
  reviews.map((review) => (
    <Card key={review.id}>
      <CardHeader>
        <div className='flex-between'>
          <CardTitle>{review.title}</CardTitle>
        </div>
        <CardDescription>{review.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex space-x-4 text-sm text-muted-foreground'>
          {/* RATING HERE */}
          <Rating value={review.rating}/>
          <div className='flex items-center'>
            <User className='mr-1 h-3 w-3' />
            {review.user ? review.user.name : 'Deleted User'}
          </div>
          <div className='flex items-center'>
            <Calendar className='mr-1 h-3 w-3' />
            {formatDateTime(review.createdAt).dateTime}
          </div>
        </div>
      </CardContent>
    </Card>
            ))}          
            </div>
      </div>
    );
  };

  export default ReviewList;