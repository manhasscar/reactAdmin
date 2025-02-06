import { createContext } from 'react';

export const MasterDataContext = createContext({
    symbols: {},
    products: {},
    excs: {},
    loading: true,
    error: null
}); 