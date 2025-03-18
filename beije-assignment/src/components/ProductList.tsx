import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAndPackets } from "../slices/productSlice";
import { RootState, AppDispatch } from "../store/store";
import { Typography, Card, CardMedia, CardContent } from "@mui/material";

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>(); 
  const products = useSelector((state: RootState) => state.product.products); 

  useEffect(() => {
    dispatch(fetchProductsAndPackets()); 
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h4">Ürünler</Typography>
      {products.map((product: any) => (
        <Card key={product._id}>
          <CardMedia component="img" height="140" image={product.image} />
          <CardContent>
            <Typography>{product.title}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
