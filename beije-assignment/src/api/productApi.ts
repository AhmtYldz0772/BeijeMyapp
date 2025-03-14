const BASE_URL = 'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io';

const GET_PRODUCTS_AND_PACKETS_ENDPOINT = '/packets-and-products';


let cachedData: any = null;

const fetchWithRetry = async (url: string, retries: number = 7, delay: number = 3000): Promise<any> => {
    try {
        const response = await fetch(url);
        if (response.status === 429 && retries > 0) {
            console.log(`${delay / 1000} saniye sonra tekrar denenecek...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
        }
        if (!response.ok) {
            throw new Error(`API error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.log(`Hata oluştu. ${delay / 1000} saniye sonra tekrar denenecek...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
        }
        throw error;
    }
};


export const fetchProductsAndPacketsFromApi = async () => {
    if (cachedData) {
        console.log("Önbellekten veri çekiliyor...");
        return cachedData;
    }

    try {
        const url = `${BASE_URL}${GET_PRODUCTS_AND_PACKETS_ENDPOINT}`;
        const data = await fetchWithRetry(url);
        cachedData = data.data;
        return cachedData;
    } catch (error) {
        console.error('API çağrısı sırasında hata:', error);
        throw error;
    }
};