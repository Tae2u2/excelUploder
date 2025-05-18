import { useDispatch, useSelector } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import ConfigReducer from "./reducer";

const rootReducer = combineReducers({
  Config: ConfigReducer,
});

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default rootReducer;
