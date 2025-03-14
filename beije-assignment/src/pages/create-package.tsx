import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

import {
  fetchProductsAndPackets,
  selectCategorizedProducts,
  selectProductLoading,
  selectProductError,
  Product,
} from '../slices/productSlice';
import { AppDispatch, RootState } from '../store/store';

type CategoryType = 'Menstrual' | 'Other';

const CreatePackagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Redux'dan çekilen ürünler: burada ürünlerin type alanına göre (Menstrual vs. Other) gruplandığını varsayıyoruz.
  const categorizedProducts = useSelector<RootState, { [key: string]: Product[] }>(selectCategorizedProducts);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  // Aktif kategori: "Menstrual" (mastürel) veya "Other" (destekleyici)
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Menstrual');
  // Seçilen ürün miktarları: ürün id => miktar (sadece kategori altındaki ürünler için)
  const [selectedQuantities, setSelectedQuantities] = useState<{ [productId: string]: number }>({});
  // Sepet sayısı (isteğe bağlı)
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    dispatch(fetchProductsAndPackets());
  }, [dispatch]);

  // Kategoriye tıklandığında activeCategory güncelleniyor
  const handleCategoryClick = (category: CategoryType) => {
    setActiveCategory(category);
  };

  // Ürün kartındaki + / - butonlarıyla miktar güncelleme
  const updateQuantity = (productId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = current + delta;
      return {
        ...prev,
        [productId]: newQuantity < 0 ? 0 : newQuantity,
      };
    });
  };

  // Seçilen ürünler üzerinden toplam fiyat hesaplama
  // Burada, ürünün fiyatını alırken ilk subProduct'ı kullanıyoruz.
  const totalPrice = () => {
    let total = 0;
    // Hem "Menstrual" hem "Other" ürünleri içinde, seçilen miktar varsa hesaplıyoruz
    Object.entries(selectedQuantities).forEach(([productId, quantity]) => {
      // İlgili ürünü bulalım
      let product: Product | undefined;
      if (categorizedProducts['Menstrual']) {
        product = categorizedProducts['Menstrual'].find((p) => p._id === productId);
      }
      if (!product && categorizedProducts['Other']) {
        product = categorizedProducts['Other'].find((p) => p._id === productId);
      }
      if (product && product.subProducts && product.subProducts.length > 0) {
        total += quantity * product.subProducts[0].price;
      }
    });
    return total;
  };

  // Sepete ekleme: seçilen ürünler ve toplam fiyat ile Verify Packet Price API çağrısı yapılıyor.
  const handleAddToCart = async () => {
    // Sepete eklenecek ürünler: [{ _id, count }]
    const packet = Object.entries(selectedQuantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ _id: productId, count: quantity }));

    if (packet.length === 0) {
      console.log("Hiç ürün seçilmedi.");
      return;
    }

    const payload = {
      packet,
      totalPrice: totalPrice(),
    };

    try {
      const response = await axios.post(
        'https://3a631b5b-9b1b-4b7f-b736-00d1ce4a1505.mock.pstmn.io/verify-packet-price',
        payload,
        {
          headers: {
            'x-auth-token': 'xxxxxxxxxxxxxxxxxxx',
          },
        }
      );
      if (response.data?.success) {
        // Başarılı ise seçilen ürünleri sıfırla, sepet sayısını güncelle
        setSelectedQuantities({});
        setCartCount((prev) => prev + 1);
        console.log("Sepete ekleme başarılı.");
      } else {
        console.error("API, paket fiyatını doğrulamada başarısız.");
      }
    } catch (error) {
      console.error("Verify Packet Price API çağrısında hata:", error);
    }
  };

  // Aktif kategoriye göre gösterilecek ürün sayısı
  const getDisplayCount = (category: CategoryType) => {
    return category === 'Menstrual' ? 3 : 2;
  };

  // Aktif kategoriye ait ürünleri filtrele ve gerekli adette göster
  const getActiveCategoryProducts = () => {
    const products = categorizedProducts[activeCategory === 'Menstrual' ? 'Menstrual' : 'Other'] || [];
    return products.slice(0, getDisplayCount(activeCategory));
  };

  return (
    <Box sx={{ backgroundColor: '#f8f8f8', minHeight: '100vh', position: 'relative' }}>
      <CssBaseline />
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
          Kendi Paketini Oluştur
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tercih ve ihtiyaçların doğrultusunda seçeceğin ürünlerden ve miktarlardan, sana özel bir paket oluşturalım.
        </Typography>

        {/* Kategori Seçimi: İki kategori yanyana */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Box
            onClick={() => handleCategoryClick('Menstrual')}
            sx={{
              cursor: 'pointer',
              px: 3,
              py: 1,
              borderBottom: activeCategory === 'Menstrual' ? '2px solid black' : '2px solid transparent',
            }}
          >
            <Typography variant="h6">Mastürel Ürünler</Typography>
          </Box>
          <Box
            onClick={() => handleCategoryClick('Other')}
            sx={{
              cursor: 'pointer',
              px: 3,
              py: 1,
              borderBottom: activeCategory === 'Other' ? '2px solid black' : '2px solid transparent',
            }}
          >
            <Typography variant="h6">Destekleyici Ürünler</Typography>
          </Box>
        </Box>

        {/* Ürün Kartları: Aktif kategoriye göre */}
        <Grid container spacing={3} justifyContent="center">
          {loading ? (
            <Grid item xs={12}>
              <Typography align="center">Yükleniyor...</Typography>
            </Grid>
          ) : error ? (
            <Grid item xs={12}>
              <Typography align="center" color="error">
                {error}
              </Typography>
            </Grid>
          ) : (
            getActiveCategoryProducts().map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={200}
                    height={200}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                    {product.title}
                  </Typography>
                  {/* Miktar Kontrolleri */}
                  <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
                    <IconButton size="small" onClick={() => updateQuantity(product._id, -1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      type="number"
                      value={selectedQuantities[product._id] || 0}
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      sx={{ width: 50, mx: 1 }}
                      onChange={(e) =>
                        setSelectedQuantities((prev) => ({
                          ...prev,
                          [product._id]: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                    <IconButton size="small" onClick={() => updateQuantity(product._id, 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {/* Ürün Fiyatı Bilgisi (ilk alt ürün üzerinden) */}
                  {product.subProducts && product.subProducts.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {product.subProducts[0].price} TL
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))
          )}
        </Grid>

        {/* Sağ Panel: Sepet Özeti */}
        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 2, maxWidth: 400, mx: 'auto', textAlign: 'center' }}
          >
            <Typography variant="h6" gutterBottom>
              Özel Paketin
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              2 ayda bir gönderim
            </Typography>
            {/* Seçilen ürünlerin özeti */}
            {Object.keys(selectedQuantities).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Herhangi bir ürün seçilmedi.
              </Typography>
            ) : (
              <Box mb={2}>
                {Object.entries(selectedQuantities)
                  .filter(([, qty]) => qty > 0)
                  .map(([prodId, qty]) => {
                    // Ürün bilgilerini bulmaya çalışıyoruz (önce Mastürel sonra Destekleyici)
                    let prod =
                      categorizedProducts['Menstrual']?.find((p) => p._id === prodId) ||
                      categorizedProducts['Other']?.find((p) => p._id === prodId);
                    return prod ? (
                      <Box key={prodId} display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                          {prod.title} x {qty}
                        </Typography>
                        <Typography variant="body2">
                          {prod.subProducts && prod.subProducts.length > 0
                            ? (prod.subProducts[0].price * qty).toFixed(2)
                            : '0'}{' '}
                          TL
                        </Typography>
                      </Box>
                    ) : null;
                  })}
              </Box>
            )}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Toplam:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {totalPrice().toFixed(2)} TL
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: 'bold', py: 1.5 }}
              onClick={handleAddToCart}
            >
              Sepete Ekle
            </Button>
            {cartCount > 0 && (
              <Typography variant="body2" color="secondary" sx={{ mt: 2 }}>
                Sepetinizde {cartCount} paket var.
              </Typography>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default CreatePackagePage;
