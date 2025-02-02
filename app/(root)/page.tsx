import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
const Homepage = async() => {
  const latestProducts=await getLatestProducts();

  return (<ProductList data={latestProducts} limit={4} title='Newest Arrival'/>  );
}

export default Homepage;