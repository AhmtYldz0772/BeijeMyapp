import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Grid, Collapse, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAndPackets, selectCategorizedProducts, selectCategorizedPackets, selectProductLoading, selectProductError, Product, Packet } from '../slices/productSlice';
import { AppDispatch, RootState } from '../store/store';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
    const [openProductsMenu, setOpenProductsMenu] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const categorizedProducts = useSelector<RootState, { [key: string]: Product[] }>(selectCategorizedProducts);
    const categorizedPackets = useSelector<RootState, { [key: string]: Packet[] }>(selectCategorizedPackets);
    const loading = useSelector(selectProductLoading);
    const error = useSelector(selectProductError);

    React.useEffect(() => {
        dispatch(fetchProductsAndPackets());
    }, [dispatch]);

    const handleProductsMenuOpen = () => {
        setOpenProductsMenu(true);
    };

    const handleProductsMenuClose = () => {
        setOpenProductsMenu(false);
    };

    const handleAccountClick = () => {
        router.push('/login');
    };

    return (
        <AppBar position="static" color="inherit" elevation={0}>

            <Box onMouseLeave={handleProductsMenuClose} >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => router.push('/login')}
                        sx={{
                            ml: 6,
                            color: "#ce7328"
                        }}
                    >
                        BEİJE
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} onMouseEnter={handleProductsMenuOpen}>

                        <Button
                            color="inherit"
                            sx={{ ml: 8 }}
                            id="products-button"
                            aria-haspopup="true"
                        >
                            Ürünler
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="inherit">Biz Kimiz?</Button>
                        <Button color="inherit">Bağış Kültürü</Button>
                        <Button color="inherit">Regl Testi!</Button>
                        <Button
                            color="inherit"
                            onClick={() => router.push('/create-package')} 
                        >
                            Kendi Paketini Oluştur
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={handleAccountClick}>
                            <ShoppingCartIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleAccountClick}>
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>


                <Collapse in={openProductsMenu} timeout="auto" unmountOnExit sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
                    <Paper elevation={0} sx={{ padding: 2, borderTop: '1px solid rgba(1, 255, 136, 0.12)' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ textAlign: 'center',fontWeight: 'bold', mb: 2 }}>Ürünler</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', overflowX: 'auto',justifyContent: 'center', pb: 2 }}>
                                {loading ? (
                                    <Typography>Yükleniyor...</Typography>
                                ) : error ? (
                                    <Typography color="error">{error}</Typography>
                                ) : (
                                    Object.entries(categorizedProducts).length === 0 ? (
                                        <Typography>Ürün Bulunamadı.</Typography>
                                    ) : (
                                        Object.entries(categorizedProducts).map(([categoryName, products]) => (
                                            <Box key={categoryName} sx={{ mr: 4, minWidth: '120px' }}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    {products.map(product => (
                                                        <Box key={product._id} sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
                                                            <Image
                                                                src={product.image}
                                                                alt={product.title}
                                                                width={80}
                                                                height={80}
                                                                style={{ borderRadius: '8px', objectFit: 'cover', display: 'block', marginBottom: '8px', marginLeft: 'auto', marginRight: 'auto' }}
                                                            />
                                                        </Box>
                                                    ))}
                                                    <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', mt: 1, display: 'block', textAlign: 'center' }}>{categoryName}</Typography>
                                                </Box>
                                            </Box>
                                        ))
                                    )
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>Paketler</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', overflowX: 'auto', justifyContent: 'center' }}>
                                {loading ? (
                                    <Typography>Yükleniyor...</Typography>
                                ) : error ? (
                                    <Typography color="error">{error}</Typography>
                                ) : (
                                    Object.entries(categorizedPackets).length === 0 ? (
                                        <Typography>Paket Bulunamadı.</Typography>
                                    ) : (
                                        Object.entries(categorizedPackets).map(([categoryName, packets]) => (
                                            <Box key={categoryName} sx={{ mr: 4, minWidth: '120px' }}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    {packets.map(packet => (
                                                        <Box key={packet._id} sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
                                                            <Image
                                                                src={packet.image}
                                                                alt={packet.title}
                                                                width={80}
                                                                height={80}
                                                                style={{ borderRadius: '8px', objectFit: 'cover', display: 'block', marginBottom: '8px', marginLeft: 'auto', marginRight: 'auto' }}
                                                            />
                                                        </Box>
                                                    ))}
                                                    <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', mt: 1, display: 'block', textAlign: 'center' }}>{categoryName}</Typography>
                                                </Box>
                                            </Box>
                                        ))
                                    )
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Collapse>
            </Box>
        </AppBar>
    );
};

export default Navbar;