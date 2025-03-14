import React, { useState, useEffect, useMemo } from 'react';
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
  Collapse,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import axios from 'axios';

import {
  fetchProductsAndPackets,
  selectCategorizedProducts,
  selectProductLoading,
  selectProductError,
  Product,
} from '../slices/productSlice';
import { AppDispatch, RootState } from '../store/store';

type ActiveCategory = 'Mastürel Ürünler' | 'Destekleyici Ürünler';

interface SubCategory {
  label: string;
  filter: (title: string) => boolean;
}

const CreatePackagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categorizedProducts = useSelector<RootState, { [key: string]: Product[] }>(selectCategorizedProducts);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('Mastürel Ürünler');
  const [expandedSubCategories, setExpandedSubCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<{ [productId: string]: number }>({});
  const [cartCount, setCartCount] = useState(0);

  // Alt kategori tanımları
  const menstrualSubcategories: SubCategory[] = [
    { label: 'beije ped', filter: (title: string) => title.trim().toLowerCase().includes('beije ped') },
    { label: 'beije günlük ped', filter: (title: string) => title.trim().toLowerCase().includes('günlük') },
    { label: 'beije tampon', filter: (title: string) => title.trim().toLowerCase().includes('tampon') },
  ];
  const supportiveSubcategories: SubCategory[] = [
    { label: 'ısı bandı', filter: (title: string) => title.trim().toLowerCase().includes('ısı bandı') },
    { label: 'beijle cycle essentials', filter: (title: string) => title.trim().toLowerCase().includes('supplement') },
  ];

  const subcategories = useMemo(() => {
    return activeCategory === 'Mastürel Ürünler' ? menstrualSubcategories : supportiveSubcategories;
  }, [activeCategory]);

  // Mastürel için maksimum 3, Destekleyici için 2 ürün gösterilecek
  const displayCount = activeCategory === 'Mastürel Ürünler' ? 3 : 2;

  useEffect(() => {
    dispatch(fetchProductsAndPackets());
  }, [dispatch]);

  // Ana kategori değişince alt kategorilerin accordion durumunu initialize et (ilk açık, diğer kapalı)
  useEffect(() => {
    const initialState: { [key: string]: boolean } = {};
    subcategories.forEach((sub, index) => {
      initialState[sub.label] = index === 0;
    });
    setExpandedSubCategories(initialState);
  }, [activeCategory, subcategories]);

  const handleCategoryClick = (category: ActiveCategory) => {
    setActiveCategory(category);
  };

  const toggleSubCategory = (label: string) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = current + delta;
      return { ...prev, [productId]: newQuantity < 0 ? 0 : newQuantity };
    });
  };

  const totalPrice = () => {
    let total = 0;
    Object.entries(selectedQuantities).forEach(([productId, quantity]) => {
      let product: Product | undefined =
        categorizedProducts['Menstrual']?.find((p) => p._id === productId) ||
        categorizedProducts['Other']?.find((p) => p._id === productId);
      if (product && product.subProducts && product.subProducts.length > 0) {
        total += quantity * product.subProducts[0].price;
      }
    });
    return total;
  };

  const getProductsForSubCategory = (sub: SubCategory) => {
    const mainProducts =
      activeCategory === 'Mastürel Ürünler'
        ? categorizedProducts['Menstrual'] || []
        : categorizedProducts['Other'] || [];
    const filtered = mainProducts.filter((p) => sub.filter(p.title));
    return filtered.slice(0, displayCount);
  };

  const handleAddToCart = async () => {
    const packet = Object.entries(selectedQuantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ _id: productId, count: quantity }));
    if (packet.length === 0) {
      console.log('Hiç ürün seçilmedi.');
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
        setSelectedQuantities({});
        setCartCount((prev) => prev + 1);
        console.log('Sepete ekleme başarılı.');
      } else {
        console.error('API, paket fiyatını doğrulamada başarısız.');
      }
    } catch (error) {
      console.error('Verify Packet Price API çağrısında hata:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <CssBaseline />
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Sol Panel: Ürünler */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
              Kendi Paketini Oluştur
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tercih ve ihtiyaçların doğrultusunda seçeceğin ürünlerden ve miktarlardan, sana özel bir paket oluşturalım.
            </Typography>
            {/* Ana kategori (üst tab) seçimi */}
            <Box display="flex" justifyContent="center" mb={2}>
              <Box
                onClick={() => handleCategoryClick('Mastürel Ürünler')}
                sx={{
                  cursor: 'pointer',
                  px: 3,
                  py: 1,
                  borderBottom: activeCategory === 'Mastürel Ürünler' ? '2px solid black' : '2px solid transparent',
                }}
              >
                <Typography variant="h6">Mastürel Ürünler</Typography>
              </Box>
              <Box
                onClick={() => handleCategoryClick('Destekleyici Ürünler')}
                sx={{
                  cursor: 'pointer',
                  px: 3,
                  py: 1,
                  borderBottom: activeCategory === 'Destekleyici Ürünler' ? '2px solid black' : '2px solid transparent',
                }}
              >
                <Typography variant="h6">Destekleyici Ürünler</Typography>
              </Box>
            </Box>
            {/* Alt Kategori Listesi (Accordion şeklinde alt alta) */}
            <Box mb={3}>
              {subcategories.map((sub) => (
                <Box key={sub.label} mb={2} border="1px solid #e0e0e0" borderRadius={1}>
                  <Box
                    onClick={() => toggleSubCategory(sub.label)}
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      backgroundColor: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {sub.label}
                    </Typography>
                    <ExpandMoreIcon
                      sx={{
                        transform: expandedSubCategories[sub.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        fontSize: '1rem',
                      }}
                    />
                  </Box>
                  <Collapse in={expandedSubCategories[sub.label]} timeout="auto" unmountOnExit>
                    <Box p={1}>
                      <Grid container spacing={1}>
                        {loading ? (
                          <Grid item xs={12}>
                            <Typography align="center" variant="body2">
                              Yükleniyor...
                            </Typography>
                          </Grid>
                        ) : error ? (
                          <Grid item xs={12}>
                            <Typography align="center" color="error" variant="body2">
                              {error}
                            </Typography>
                          </Grid>
                        ) : (
                          getProductsForSubCategory(sub).map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                              <Paper sx={{ p: 1, textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <LocalOfferIcon fontSize="small" />
                                  <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 0.5 }}>
                                    {product.title}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 0.5 }}>
                                  <IconButton size="small" onClick={() => updateQuantity(product._id, -1)}>
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <TextField
                                    type="number"
                                    value={selectedQuantities[product._id] || 0}
                                    inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '0.8rem' } }}
                                    sx={{ width: 40, mx: 0.5 }}
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
                                {product.subProducts && product.subProducts.length > 0 && (
                                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {product.subProducts[0].price} TL
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>
                          ))
                        )}
                      </Grid>
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </Box>
          </Grid>
          {/* Sağ Panel: Sepet Özeti (sadece isim, adet ve fiyat bilgisi) */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                position: 'sticky',
                top: '20px',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Özel Paketin
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                2 ayda bir gönderim
              </Typography>
              {Object.keys(selectedQuantities).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Herhangi bir ürün seçilmedi.
                </Typography>
              ) : (
                <Box mb={2}>
                  {Object.entries(selectedQuantities)
                    .filter(([, qty]) => qty > 0)
                    .map(([prodId, qty]) => {
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
                              : '0'} TL
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
                <Typography variant="body2" color="secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Sepetinizde {cartCount} paket var.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreatePackagePage;
