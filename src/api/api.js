import axios from 'axios';

// API 서버의 기본 URL 설정
const BASE_URL = '/api';

/**
 * axios 인스턴스 생성
 * - baseURL: 모든 요청의 기본 URL
 * - timeout: 요청 제한 시간 (5초)
 */
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

// /**
//  * API 요청을 위한 헤더 정보를 생성하는 함수
//  * @param {Object} requestData - API 요청 데이터
//  * @param {Object} headerConfig - 기본 헤더 설정
//  * @returns {Object} 설정된 헤더 정보
//  */
// export const makeRequestHeader = (requestData, headerConfig = {}) => {
    
//     return {
//         ...headerConfig,
//         'Accept': 'text/plain, */*; q=0.01',
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//     };
// };

// /**
//  * 요청 인터셉터 설정
//  * - 모든 API 요청 전에 실행
//  * - localStorage에서 토큰을 가져와 헤더에 추가
//  */
// api.interceptors.request.use(
//     (config) => {
//         config.headers = makeRequestHeader(config.data || {}, config.headers);
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

api.interceptors.response.use(
    (response) => {
        console.log(response);
        return response.data.body;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 인증 관련 API 함수들
 * - login: 이메일과 비밀번호로 로그인 요청
 */
export const authAPI = {
    login: (admin_id, admin_pass) => 
    api.post('', {
        head: {
            queryType: 'T',
            endpoint: 'ad_user',
            trcode: 'ad_admin_login'
        },
        body: {
            InBlock1: [{
                admin_id: admin_id,
                admin_pass: admin_pass
            }]
        }
    }),
};

/**
 * ENT_USER 관련 함수들
 * - getUsers: 유저 목록 조회
 * - getUserAgreement: 유저 약관 조회
 */
export const userAPI = {
    getUsers: (search_word, next_key) => {
        return api.post('', {
            head: {
                queryType: 'T',
            endpoint: 'ad_user',
            trcode: 'ad_user_get'
        },
        body: {
            InBlock1: [{
                search_word: search_word,
                    next_key: next_key
                }]
            }
        });
    },
    updateUserInformation: (user_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_user',
                trcode: 'ad_user_upd'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid,
                    user_name: user_data.user_name,
                    user_birth: user_data.user_birth,
                    user_tel: user_data.user_tel,
                    user_email: user_data.user_email,
                    user_used: user_data.user_used,
                    tend_grade: user_data.tend_grade,
                    tend_date: user_data.tend_date,
                    qual_grade: user_data.qual_grade
                }]
            }
        });
    },
    getUserAgreement: (user_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_user',
                trcode: 'ad_agree_get'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid
                }]
            }
        });
    },
    updateUserAgreement: (user_uid, terms_code, terms_type, terms_agree) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_user',
                trcode: 'ad_agree_upd'
            },
            body: {
                InBlock1: [{
                    user_uid: user_uid,
                    terms_code: terms_code,
                    terms_type: terms_type,
                    terms_agree: terms_agree
                }]
            }
        });
    }
};

/**
 * ENT_PRODUCT 관련 API 함수
 * - getUserAccount: 유저 계좌 자산 조회
 * - getUserSymbol: 유저 종목 조회
 * - getUserOffer: 유저 공모 조회
 * 
 */
export const productAPI = {
    getUserAccount: (user_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'ad_acnt_get'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid
                }]
            }
        });
    },
    getUserSymbol: (user_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'ad_pos_get'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid,
                    acnt_cd: user_data.acnt_cd
                }]
            }
        });
    },
    getUserOffer: (user_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'ad_offer_user_get'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid
                }]
            }
        });
    },
    registerUserAccount: (user_data, acnt_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'ad_acnt_reg'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid,
                    bank_code: acnt_data.bank_code,
                    acnt_linked: acnt_data.acnt_linked,
                    qual_limit: Number(acnt_data.qual_limit),
                }]
            }
        });
    },
    updateUserAccount: (user_data, acnt_data) => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'ad_acnt_upd'
            },
            body: {
                InBlock1: [{
                    user_uid: user_data.user_uid,
                    acnt_cd: acnt_data.acnt_cd,
                    qual_limit: Number(acnt_data.qual_limit),
                }]
            }
        });
    }
};

/**
 * 마스터 관련 API 함수들
 * - getSymbolMaster: 종목 마스터
 * - getProductMaster: 상품 마스터
 * - getExcMaster: 거래소 마스터
 */
export const masterAPI = {
    getSymbolMaster: () => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'sym_mst'
            },
            body: {
                InBlock1: [{}]
            }   
        });
    },
    getProductMaster: () => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'prod_mst'
            },
            body: {
                InBlock1: [{}]
            }   
        });
    },
    getExcMaster: () => {
        return api.post('', {
            head: {
                queryType: 'T',
                endpoint: 'ad_product',
                trcode: 'exchange_mst'
            },
            body: {
                InBlock1: [{}]
            }   
        });
    }
};

/**
 * 거래 관련 API 함수들
 * - getTransactions: 거래 내역 조회 (필터링 가능)
 */
export const transactionAPI = {
    getTransactions: (params) => 
        api.get('/transactions', { params }),
};

export default api; 