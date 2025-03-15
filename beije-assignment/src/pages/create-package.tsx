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
import { useDispatch } from 'react-redux';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';


import axios from 'axios';

import {
  fetchProductsAndPackets,
  selectCategorizedProducts,
  selectProductLoading,
  selectProductError,
  Product,
} from '../slices/productSlice';
import { AppDispatch, RootState } from '../store/store';


interface HardcodedSubProduct {
  id: string;
  name: string;
  price: number;
}

const staticProducts: { [subLabel: string]: HardcodedSubProduct[] } = {
  'beije ped': [
    { id: 'bp1', name: 'Standart ped', price: 125 },
    { id: 'bp2', name: 'Süper ped', price: 178 },
    { id: 'bp3', name: 'Süper+ ped', price: 220 },
  ],
  'beije günlük ped': [
    { id: 'bgp1', name: 'Günlük ped', price: 180 },
    { id: 'bgp2', name: 'Süper Günlük ped', price: 220 },
  ],
  'beije tampon': [
    { id: 'bt1', name: 'Mini tampon ped', price: 80 },
    { id: 'bt2', name: 'Standart tampon ped', price: 90 },
    { id: 'bt3', name: 'Süper tampon ped', price: 100 },
  ],
  'ısı bandı': [
    { id: 'ib1', name: "2'li paket ısı bandı", price: 210 },
    { id: 'ib2', name: "4'lü paket ısı bandı", price: 280 },
  ],
  'beijle cycle essentials': [
    { id: 'ce1', name: 'beije Cycle Essentials', price: 500 },
  ],
};

const hardcodedProductMap = Object.values(staticProducts).flat().reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {} as { [id: string]: HardcodedSubProduct });

type ActiveCategory = 'Mastürel Ürünler' | 'Destekleyici Ürünler';

interface SubCategory {
  label: string;
  filter: (title: string) => boolean;
}

const CreatePackagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const categorizedProducts = useSelector((state: RootState) => state.product.categorizedProducts);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('Mastürel Ürünler');
  const [expandedSubCategories, setExpandedSubCategories] = useState<{ [key: string]: boolean }>({});
  
  const [selectedSubProducts, setSelectedSubProducts] = useState<{ [id: string]: number }>({});
  const [cartCount, setCartCount] = useState(0);

  
  const menstrualSubcategories: SubCategory[] = [
    { label: 'beije ped', filter: () => true },
    { label: 'beije günlük ped', filter: () => true },
    { label: 'beije tampon', filter: () => true },
  ];
  const supportiveSubcategories: SubCategory[] = [
    { label: 'ısı bandı', filter: () => true },
    { label: 'beijle cycle essentials', filter: () => true },
  ];

  const subcategories = useMemo(() => {
    return activeCategory === 'Mastürel Ürünler' ? menstrualSubcategories : supportiveSubcategories;
  }, [activeCategory]);

  useEffect(() => {
    dispatch(fetchProductsAndPackets());
  }, [dispatch]);

  
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

  const updateSubProductQuantity = (subId: string, delta: number) => {
    setSelectedSubProducts((prev) => {
      const current = prev[subId] || 0;
      const newQuantity = current + delta;
      return { ...prev, [subId]: newQuantity < 0 ? 0 : newQuantity };
    });
  };

  const totalPrice = () => {
    let total = 0;
    Object.entries(selectedSubProducts).forEach(([subId, qty]) => {
      const prod = hardcodedProductMap[subId];
      if (prod) {
        total += qty * prod.price;
      }
    });
    return total;
  };

  const handleAddToCart = async () => {
    const packet = Object.entries(selectedSubProducts)
      .filter(([, quantity]) => quantity > 0)
      .map(([subId, quantity]) => ({ _id: subId, count: quantity }));
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
        'https://3a631b5b-9b1b-4da5-b736-00d1ce4a1505.mock.pstmn.io/verify-packet-price',
        payload,
        {
          headers: {
            'x-auth-token': 'xxxxxxxxxxxxxxxxxxx',
          },
        }
      );
      if (response.data?.success) {
        setSelectedSubProducts({});
        setCartCount((prev) => prev + 1);
        console.log('Sepete ekleme başarılı.');
      } else {
        console.error('API, paket fiyatını doğrulamada başarısız.');
      }
    } catch (error) {
      console.error('Verify Packet Price API çağrısında hata:', error);
    }
  };

  
  const getHardcodedProductsForSubCategory = (subLabel: string) => {
    return staticProducts[subLabel] || [];
  };

  
  const getIconForSubCategory = (subLabel: string) => {
    if (activeCategory === 'Mastürel Ürünler') {
      if (subLabel === 'beije ped' || subLabel === 'beije günlük ped') {
        return <LocalOfferIcon fontSize="small" />;
      } else if (subLabel === 'beije tampon') {
        return <LocalPharmacyIcon fontSize="small" />;
      }
    } else {
      if (subLabel === 'ısı bandı') {
        return <CheckroomIcon fontSize="small" />;
      } else if (subLabel === 'beijle cycle essentials') {
        return <LocalPharmacyIcon fontSize="small" />;
      }
    }
    return null;
  };

  return (
    <Box sx={{ backgroundColor: '#f8f8f8', minHeight: '80vh' }}>
      <CssBaseline />
      <Container component="main" maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Kendi Paketini Oluştur
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tercih ve ihtiyaçların doğrultusunda seçeceğin ürünlerden ve miktarlardan, sana özel bir paket oluşturalım.
        </Typography>
        
        <Box display="flex" gap={2} sx={{ mb: 2, overflowX: 'auto',  marginLeft: '200px'}}>
          <Box
            sx={{
              cursor: 'pointer',
              borderBottom: activeCategory === 'Mastürel Ürünler' ? '2px solid black' : '2px solid transparent',
              pb: 1,
            }}
            onClick={() => handleCategoryClick('Mastürel Ürünler')}
          >
            <Typography variant="h6">Mastürel Ürünler</Typography>
          </Box>
          <Box
            sx={{
              cursor: 'pointer',
              borderBottom: activeCategory === 'Destekleyici Ürünler' ? '2px solid black' : '2px solid transparent',
              pb: 1,
            }}
            onClick={() => handleCategoryClick('Destekleyici Ürünler')}
          >
            <Typography variant="h6">Destekleyici Ürünler</Typography>
          </Box>
        </Box>
        <Grid container spacing={4}>
          
          <Grid item xs={12} md={7}>
            {subcategories.map((sub) => (
              <Box key={sub.label} mb={3} border="1px solid #e0e0e0" borderRadius={2}>
                <Box
                  onClick={() => toggleSubCategory(sub.label)}
                  sx={{
                    cursor: 'pointer',
                    p: 1,
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius:6,
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
                    {/* Ürünler alt alta listelenecek */}
                    {getHardcodedProductsForSubCategory(sub.label).map((prod) => (
                      <Paper key={prod.id} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getIconForSubCategory(sub.label)}
                          <Typography variant="subtitle2" fontWeight="bold">
                            {prod.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateSubProductQuantity(prod.id, -1)}
                            sx={{ borderRadius: '50%' }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" sx={{ minWidth: '24px', textAlign: 'center' }}>
                            {selectedSubProducts[prod.id] || 0}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateSubProductQuantity(prod.id, 1)}
                            sx={{ borderRadius: '50%' }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {prod.price} TL
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Grid>
          {/* Sağ Panel: Sepet Özeti */}
          <Grid item xs={12} md={5}>
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
              {Object.keys(selectedSubProducts).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Henüz ürün eklemediniz.
                </Typography>
              ) : (
                <Box mb={2}>
                  {Object.entries(selectedSubProducts).map(([subId, qty]) => {
                    const prod = hardcodedProductMap[subId];
                    return prod ? (
                      <Box key={subId} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {prod.name} x {qty}
                        </Typography>
                        <Typography variant="body2">
                          {(prod.price * qty).toFixed(2)} TL
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
