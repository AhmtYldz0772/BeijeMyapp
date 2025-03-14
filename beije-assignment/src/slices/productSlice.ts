import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProductsAndPacketsFromApi } from '../api/productApi';
import { RootState } from '../store/store';

export interface Product {
    _id: string;
    title: string;
    image: string;
    type: string; 
    subProducts: SubProduct[]; 
}

export interface SubProduct {
    _id: string;
    name: string;
    price: number;
}

export interface Packet {
    _id: string;
    title: string;
    image: string;
}


interface ProductState {
    products: Product[];
    packets: Packet[];
    loading: boolean;
    error: string | null;
    categorizedProducts: { [key: string]: Product[] }; 
    categorizedPackets: { [key: string]: Packet[] };   
}

const initialState: ProductState = {
    products: [],
    packets: [],
    loading: false,
    error: null as string | null,
    categorizedProducts: {}, 
    categorizedPackets: {},  
};

interface FetchProductsAndPacketsPayload {
    products: Product[];
    packets: Packet[];
}

export const fetchProductsAndPackets = createAsyncThunk<FetchProductsAndPacketsPayload>(
    'product/fetchProductsAndPackets',
    async () => {
        const response = await fetchProductsAndPacketsFromApi();
        return response;
    }
);

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProductsAndPackets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProductsAndPackets.fulfilled, (state, action: PayloadAction<FetchProductsAndPacketsPayload>) => {
            state.loading = false;
            state.products = action.payload.products;
            state.packets = action.payload.packets;

            const categorizedProducts: { [key: string]: Product[] } = {};

            
            const productCategoryMap: { [key: string]: string } = {
                "beije Ped": "beije Ped",
                "beije Günlük Pad": "beije Günlük Ped",
                "beije Tampon": "beije Tampon",
                "beije Kap": "beije Kap",
                "beije ısı bandı": "Isı Bandı", 
                "Supplement": "Supplement", 
            };


            action.payload.products.forEach(product => {
                const categoryName = productCategoryMap[product.title];
                if (categoryName) {
                    if (!categorizedProducts[categoryName]) {
                        categorizedProducts[categoryName] = [];
                    }
                    categorizedProducts[categoryName].push(product);
                } else {
                    
                    console.warn(`Kategorisi belirlenemeyen ürün: ${product.title}`);
                    if (!categorizedProducts['Diğer']) {
                        categorizedProducts['Diğer'] = [];
                    }
                    categorizedProducts['Diğer'].push(product);
                }
            });
            state.categorizedProducts = categorizedProducts;


          
            const categorizedPackets: { [key: string]: Packet[] } = {};
            const packetCategoryMap: { [key: string]: string } = {
                "Popüler Paketler": "Popüler Paketler",
                "Ped Paketleri": "Ped Paketleri",
                "Tampon Paketleri": "Tampon Paketleri",
                "Kap Paketleri": "Kap Paketleri",
            };

            action.payload.packets.forEach(packet => {
                const categoryName = packetCategoryMap[packet.title];
                if (categoryName) {
                    if (!categorizedPackets[categoryName]) {
                        categorizedPackets[categoryName] = [];
                    }
                    categorizedPackets[categoryName].push(packet);
                } else {
                    
                    console.warn(`Kategorisi belirlenemeyen paket: ${packet.title}`);
                    if (!categorizedPackets['Diğer']) {
                        categorizedPackets['Diğer'] = [];
                    }
                    categorizedPackets['Diğer'].push(packet);
                }
            });
            state.categorizedPackets = categorizedPackets;


        });
        builder.addCase(fetchProductsAndPackets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Veri yüklenirken bir hata oluştu.';
        });
    },
});

export default productSlice.reducer;
export const { } = productSlice.actions;


export const selectProducts = (state: RootState): Product[] => state.product.products;
export const selectPackets = (state: RootState): Packet[] => state.product.packets;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;


export const selectCategorizedProducts = (state: RootState): { [key: string]: Product[] } => state.product.categorizedProducts;
export const selectCategorizedPackets = (state: RootState): { [key: string]: Packet[] } => state.product.categorizedPackets;