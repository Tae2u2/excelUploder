import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  table: {

  },
};

const ConfigSlice = createSlice({
  name: 'Config',
  initialState,
  reducers: {
    configTable: (state: any, action: any) => {
      const { key, value } = action.payload;
      if (!state.table[key].includes(value)) {
        state.table[key].push(value);
      } else {
        state.table[key] = state.table[key].filter(
          (column: any) => column !== value
        );
      }
    },
    configTableAll: (state: any, action: any) => {
      const { key, value } = action.payload;
      state.table[key] = value;
    },
  },
  // extraReducers: builder => {},
  extraReducers: () => {},
});

export const { configTable, configTableAll } = ConfigSlice.actions;
export default ConfigSlice.reducer;
