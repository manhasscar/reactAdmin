import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { koKR } from '@mui/x-data-grid/locales';
import { koKR as pickersBgBG } from '@mui/x-date-pickers/locales';
import { koKR as coreBgBG } from '@mui/material/locale';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DepositWithdrawPage from './pages/DepositWithdrawPage';
import UserManagementPage from './pages/user/UserManagementPage';
import { isAuthenticated } from './utils/auth';
import { masterAPI } from './api/api';
import { MasterDataContext } from './contexts/MasterDataContext';
import LoadingIndicator from './components/common/LoadingIndicator';
import CONSTANT from './config/constant';
/**
 * 전역 테마 설정
 * - primary: 주요 색상
 * - secondary: 보조 색상
 * - background: 배경 색상
 */

const theme = createTheme({
    typography: {
        fontFamily: 'Noto Sans KR, sans-serif',
    },
    koKR, // x-data-grid translations
    pickersBgBG, // x-date-pickers translations
    coreBgBG, // core translations
});

/**
 * 인증이 필요한 라우트를 위한 컴포넌트
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */
const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

/**
 * 앱의 메인 컴포넌트
 * - 전역 스타일 및 테마 적용
 * - 라우팅 설정
 * - 인증 보호 적용
 */
const App = () => {
    const [masterData, setMasterData] = useState({
        symbols: {},    // 종목 마스터 (객체 형태)
        products: {},   // 상품 마스터 (객체 형태)
        excs: {},       // 거래소 마스터 (객체 형태)
        loading: true,
        error: null
    });

    // 마스터 데이터 로드
    const loadMasterData = async () => {
        try {
            const [
                symbolResponse,
                productResponse,
                excResponse
            ] = await Promise.all([
                masterAPI.getSymbolMaster(),
                masterAPI.getProductMaster(),
                masterAPI.getExcMaster(),
            ]);

            // 데이터를 객체 형태로 변환
            const symbolsMap = symbolResponse.OutBlock1.reduce((acc, item) => {
                const key = `${item.exchange_code}.${item.symbol_code}`;
                acc[key] = item;
                return acc;
            }, {});

            const productsMap = productResponse.OutBlock1.reduce((acc, item) => {
                const key = item.product_code;
                acc[key] = item;
                return acc;
            }, {});

            const excsMap = excResponse.OutBlock1.reduce((acc, item) => {
                const key = item.exchange_code;
                acc[key] = item;
                return acc;
            }, {});

            setMasterData({
                symbols: symbolsMap,
                products: productsMap,
                excs: excsMap,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('마스터 데이터 로드 실패:', error);
            setMasterData(prev => ({
                ...prev,
                loading: false,
                error: CONSTANT.ERROR_MESSAGE.FAILED_GET_MASTER_DATA
            }));
        }
    };

    useEffect(() => {
        if(isAuthenticated()) {
            loadMasterData();
        }
    }, []);

    if(masterData.loading) {
        return <LoadingIndicator open={true} />;
    }

    return (
        <ThemeProvider theme={theme}>
            <MasterDataContext.Provider value={masterData}>
                <GlobalStyles />
                <Router>
                    <Routes>
                        {/* 공개 라우트 */}
                        <Route path="/login" element={<LoginPage />} />
                        {/* 보호된 라우트 */}
                        <Route
                            path="/*"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Routes>
                                            <Route path="/transactions" element={<DepositWithdrawPage />} />
                                            <Route path="/users" element={<UserManagementPage />} />
                                            {/* 추가 보호된 라우트들 */}
                                        </Routes>
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </MasterDataContext.Provider>
        </ThemeProvider>
    );
};

export default App;
