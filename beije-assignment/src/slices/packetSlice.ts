
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store/store';

export interface Packet {
  _id: string;
  title: string;
  image: string;
}

interface PacketState {
  packets: Packet[];
  loading: boolean;
  error: string | null;
}

const initialState: PacketState = {
  packets: [],
  loading: false,
  error: null,
};

export const fetchPackets = createAsyncThunk<Packet[]>(
  'packet/fetchPackets',
  async () => {
    const response = await axios.get('https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io/packets-and-products');
    
    return response.data.data.packets;
  }
);

const packetSlice = createSlice({
  name: 'packet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPackets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPackets.fulfilled, (state, action: PayloadAction<Packet[]>) => {
      state.loading = false;
      state.packets = action.payload;
    });
    builder.addCase(fetchPackets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Paket verileri yüklenirken bir hata oluştu.';
    });
  },
});

export default packetSlice.reducer;

// Selector'lar
export const selectPackets = (state: RootState): Packet[] => state.packet.packets;
export const selectPacketLoading = (state: RootState) => state.packet.loading;
export const selectPacketError = (state: RootState) => state.packet.error;
