import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/product.actions";
const Homepage = async() => {
  const latestProducts=await getLatestProducts();
  const featuredProducts=await getFeaturedProducts();
   
  return (
  <div>
  {featuredProducts.length>0&&<ProductCarousel data={featuredProducts}/>}
  <ProductList data={latestProducts} limit={4} title='Newest Arrival'/> 
  <ViewAllProductsButton/>
  </div>);
}

export default Homepage;