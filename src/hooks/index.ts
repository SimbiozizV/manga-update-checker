import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { Store } from '../state';
import { Store as StoreType } from '../types/Store';

type AppDispatch = Store['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;
