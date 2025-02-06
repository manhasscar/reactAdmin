import { useState, useEffect } from 'react';
import {
    Box,
    Modal,
    Button,
    Typography,
    TextField,
    IconButton,
    Tabs,
    Tab,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    InputAdornment
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CustomDataGrid from '../common/CustomDataGrid';
import AlertBar from '../common/AlertBar';
import LoadingIndicator from '../common/LoadingIndicator';
import CONFIG from '../../config/config';
import { productAPI, userAPI } from '../../api/api';
import CONSTANT from '../../config/constant';
import { NumericFormat } from 'react-number-format';

/**
 * 회원 상세 정보를 표시하고 관리하는 모달 컴포넌트
 * 
 * 주요 기능:
 * 1. 회원 기본 정보 조회/수정
 * 2. 계좌 정보 조회/수정/등록
 * 3. 보유 자산 조회 (상장 종목/공모 종목)
 * 4. 약관 동의 내역 조회/수정
 * 
 * @param {Object} props
 * @param {boolean} props.open - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Function} props.onSave - 저장 완료 후 콜백
 * @param {Object} props.userData - 표시할 회원 데이터
 * @param {Object} props.paginationModel - 페이지네이션 설정
 * @param {Function} props.onPaginationModelChange - 페이지네이션 변경 핸들러
 * @param {string} props.error - 에러 메시지
 */
const UserDetailModal = ({ 
    open, 
    onClose,
    onSave,
    userData,
    paginationModel,
    onPaginationModelChange,
    error 
}) => {
    // State 관리
    // 1. UI 관련 상태
    const [activeTab, setActiveTab] = useState(0);          // 현재 활성화된 탭
    const [assetView, setAssetView] = useState('symbol');   // 자산 조회 뷰 (상장/공모)
    const [loading, setLoading] = useState(false);          // 로딩 상태
    const [alertOpen, setAlertOpen] = useState(false);      // 알림창 표시 여부
    const [alertMessage, setAlertMessage] = useState('');   // 알림 메시지
    const [alertType, setAlertType] = useState('');         // 알림 타입
    const [accountError, setAccountError] = useState(false); // 계좌 입력 오류 여부

    // 2. 데이터 관련 상태
    const [selectedUser, setSelectedUser] = useState(null);     // 현재 선택된 회원 원본 데이터
    const [editedUser, setEditedUser] = useState(null);        // 수정 중인 회원 데이터
    const [userAccount, setUserAccount] = useState(null);      // 회원 계좌 목록
    const [selectedAccount, setSelectedAccount] = useState(null); // 선택된 계좌 원본 데이터
    const [editedAccount, setEditedAccount] = useState(null);    // 수정 중인 계좌 데이터
    const [symbolData, setSymbolData] = useState([]);          // 보유 종목 데이터
    const [offerData, setOfferData] = useState([]);            // 공모 종목 데이터
    const [agreementData, setAgreementData] = useState([]);    // 약관 동의 데이터

    // 회원 데이터 초기 세팅
    useEffect(() => {
        if(open && userData) {
            setEditedUser(userData);
            setSelectedUser(userData);
            getUserAccount(userData);
            getUserAgreement(userData);
        }
    }, [open, userData]);

    // 모달 닫힐 때 데이터 초기화
    useEffect(() => {
        if(!open) {
            setEditedUser(null);
            setSelectedUser(null);
            setUserAccount(null);
            setEditedAccount(null);
            setSelectedAccount(null);
            setAccountError(false);
            setSymbolData([]);
            setOfferData([]);
            setAgreementData([]);
            setAssetView('symbol');
            setActiveTab(0);
        }
    }, [open]);

    // 계좌 데이터 초기 세팅
    useEffect(() => {
        if(userAccount && userAccount.length > 0) {
            setSelectedAccount(userAccount[0]);
            setEditedAccount(userAccount[0]);
            return;
        }
    }, [userAccount]);

    /**
     * API 호출 함수들
     * - 각 함수는 try-catch로 에러 처리
     * - 로딩 상태 관리
     * - 응답 데이터 가공 및 상태 업데이트
     * - getUserAccount: 회원 계좌 조회
     */
    const getUserAccount = async (userData) => {
        try {
            setLoading(true);
            const response = await productAPI.getUserAccount(userData);
            console.log(response);
            setUserAccount(response.OutBlock1[0].acnt_list);
            setEditedAccount(response.OutBlock1[0].acnt_list);
        } 
        catch(error) {
            console.error('계좌 조회 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_GET_USER_ACCOUNT);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 보유 종목 조회
     * - 종목 데이터 가공 및 상태 업데이트
     */
    const getUserSymbol = async (userData) => {
        try {
            setLoading(true);
            const response = await productAPI.getUserSymbol(userData);
            const mappedSymbol = await response.OutBlock1.map(symbol => ({
                ...symbol,
                id: symbol.next_key
            }));
            console.log(response);
            setSymbolData(mappedSymbol);
        } 
        catch(error) {
            console.error('종목 조회 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_GET_USER_SYMBOL);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 공모 종목 조회
     * - 공모 데이터 가공 및 상태 업데이트
     */
    const getUserOffer = async (userData) => {
        try {
            setLoading(true);
            const response = await productAPI.getUserOffer(userData);
            const mappedOffer = await response.OutBlock1.map(offer => ({
                ...offer,
                id: offer.next_key
            }));
            console.log(response);
            setOfferData(mappedOffer);
        }
        catch(error) {
            console.error('공모 종목 조회 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_GET_USER_OFFER);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 약관 동의 조회
     * - 약관 데이터 가공 및 상태 업데이트
     */
    const getUserAgreement = async (userData) => {
        try {
            setLoading(true);
            const pattern = /[^/]+\.pdf$/;
            const response = await userAPI.getUserAgreement(userData);
            const mappedAgreement = await response.OutBlock1.map(agreement => ({
                ...agreement,
                id: `${agreement.terms_code}-${agreement.terms_type}`,
                terms_file: agreement.terms_file.match(pattern)
            }));
            console.log(response);
            setAgreementData(mappedAgreement);
        }
        catch(error) {
            console.error('약관 조회 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_GET_USER_AGREEMENT);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 약관 동의 업데이트
     * - 약관 데이터 업데이트 및 상태 업데이트
     */
    const updateUserAgreement = async (userUid, termsCode, termsType, termsAgree) => {
        try {
            setLoading(true);
            await userAPI.updateUserAgreement(userUid, termsCode, termsType, termsAgree);
            setAgreementData(prevData => 
                prevData.map(agreement => 
                    agreement.id === `${termsCode}-${termsType}` 
                        ? { ...agreement, terms_agree: termsAgree }
                        : agreement
                )
            );
        }
        catch(error) {
            console.error('약관 동의 업데이트 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_UPDATE_USER_AGREEMENT);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 회원 정보 업데이트
     * - 회원 데이터 업데이트 및 상태 업데이트
     */
    const updateUserInformation = async (editedUser) => {
        try {
            setLoading(true);
            await userAPI.updateUserInformation(editedUser);
            setSelectedUser(prevData => (
                {
                    ...prevData,
                    ...editedUser
                }
            ))

             // 성공 시 부모 컴포넌트의 onSave 호출하여 데이터 업데이트
            onSave(editedUser);
            setAlertMessage(CONSTANT.SUCCESS_MESSAGE.UPDATE_USER_INFORMATION);
            setAlertType('success');
            setAlertOpen(true);
        }
        catch(error) {
            console.error('회원 정보 업데이트 핸들 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_UPDATE_USER_INFORMATION);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 회원 계좌 업데이트
     * - 계좌 데이터 업데이트 및 상태 업데이트
     */
    const updateUserAccount = async (userData, editedAccount) => {
        try {
            setLoading(true);
            await productAPI.updateUserAccount(userData, editedAccount);
            setUserAccount(prevData => (
                {
                    ...prevData,
                    ...editedAccount
                }
            ));

            setAlertMessage(CONSTANT.SUCCESS_MESSAGE.UPDATE_USER_ACCOUNT);
            setAlertType('success');
            setAlertOpen(true);
            getUserAccount(userData);
        }
        catch(error) {
            console.error('계좌 업데이트 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_UPDATE_USER_ACCOUNT);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 회원 계좌 등록
     * - 계좌 데이터 등록 및 상태 업데이트
     */
    const registerUserAccount = async (userData, editedAccount) => {
        try {
            setLoading(true);
            await productAPI.registerUserAccount(userData, editedAccount);
            setAlertMessage(CONSTANT.SUCCESS_MESSAGE.REGISTER_USER_ACCOUNT);
            setAlertType('success');
            setAlertOpen(true);
            getUserAccount(userData);
        }
        catch(error) {
            console.error('계좌 등록 실패:', error);
            setAlertMessage(CONSTANT.ERROR_MESSAGE.FAILED_REGISTER_USER_ACCOUNT);
            setAlertType('error');
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 이벤트 핸들러
     * - 사용자 입력 처리
     * - 데이터 변경 사항 검증
     * - API 호출 트리거
     */
    const handleTabChange = (e, newValue) => {
        if(newValue === 1) {
            getUserAccount(userData);
        }
        if(newValue === 2) {
            getUserSymbol(userData);
        }
        if(newValue === 3) {
            getUserAgreement(userData);
        }
        setActiveTab(newValue);
    };

    /**
     * 회원 정보 변경 핸들러
     * - 회원 데이터 업데이트 및 상태 업데이트
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * 계좌 정보 변경 핸들러
     * - 계좌 데이터 업데이트 및 상태 업데이트
     */
    const handleAccountChange = (e) => {
        console.log(e);
        const { name, value } = e.target;
        setEditedAccount(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * 계좌 목록 변경 핸들러
     * - 계좌 데이터 업데이트 및 상태 업데이트
     */
    const handleAccountListChange = (e) => {
        const selectedValue = e.target.value;

        console.log(selectedValue);
        setAccountError(false);
        if(selectedValue === 'N') {
            // 신규 계좌 추가 선택 시 빈 객체로 초기화
            const emptyAccount = {
                acnt_cd: '',
                bank_code: '',
                acnt_linked: '',
                deposit_amt: '',
                qual_limit: ''
            };
            setSelectedAccount(emptyAccount);
            setEditedAccount(emptyAccount);
        } 
        else {
            // 기존 계좌 선택 시 해당 계좌 정보로 설정
            const selectedAccountData = userAccount.find(account => 
                account.acnt_cd === selectedValue
            );
            setSelectedAccount(selectedAccountData);
            setEditedAccount(selectedAccountData);
        }
    };

    /**
     * 회원 정보 업데이트 핸들러
     * - 회원 데이터 업데이트 및 상태 업데이트
     */
    const handleUpdateUserInformation = () => {
        // 변경사항 체크
        const checkChanges = () => {
            if (!selectedUser || !editedUser) return false;
            
            return Object.keys(editedUser).some(key => {
                const oldValue = selectedUser[key];
                const newValue = editedUser[key];
                
                if (oldValue === undefined || newValue === undefined) return false;
                return oldValue !== newValue;
            });
        };

        if (!checkChanges()) {
            setAlertMessage(CONSTANT.ERROR_MESSAGE.NO_DIFFERENT_USER_DATA);
            setAlertType('warning');
            setAlertOpen(true);
            return;
        }

        updateUserInformation(editedUser);
    };

    /**
     * 회원 계좌 업데이트 핸들러
     * - 계좌 데이터 업데이트 및 상태 업데이트
     */
    const handleUpdateUserAccount = () => {
        // 변경사항 체크
        const checkChanges = () => {
            if (!selectedAccount || !editedAccount) return false;
            
            return Object.keys(editedAccount).some(key => {
                const oldValue = selectedAccount[key];
                const newValue = editedAccount[key];
                
                if (oldValue === undefined || newValue === undefined) return false;
                return oldValue !== newValue;
            });
        };

        if (!checkChanges()) {
            setAlertMessage(CONSTANT.ERROR_MESSAGE.NO_DIFFERENT_USER_DATA);
            setAlertType('warning');
            setAlertOpen(true);
            return;
        }
        updateUserAccount(userData, editedAccount);
    };

    /**
     * 회원 계좌 등록 핸들러
     * - 계좌 데이터 등록 및 상태 업데이트
     */
    const handleRegisterUserAccount = () => {
        registerUserAccount(userData, editedAccount);
    };

    /**
     * 저장 핸들러
     * - 탭별 데이터 업데이트 및 상태 업데이트
     */
    const handleSave = () => {
        switch(activeTab) {
            case 0:
                handleUpdateUserInformation();
                break;
            case 1:
                if(!accountValidation()) return;
                if(selectedAccount.acnt_cd === '') {
                    handleRegisterUserAccount();
                }
                else {
                    handleUpdateUserAccount();
                }
                break;
            default:
                console.warn('저장 기능이 정의되지 않은 탭입니다.');
                break;
        }
    };

    /**
     * 알림창 닫기 핸들러
     * - 알림창 상태 업데이트
     */
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    /**
     * 자산 그리드 변경 핸들러
     * - 상장 or 종목 그리드 변경
     */
    const handleAssetViewChange = (e) => {
        const newView = e.target.value;
        setAssetView(newView);
        
        if(newView === 'symbol') {
            getUserSymbol(userData);
        }
        else if(newView === 'offer') {
            getUserOffer(userData);
        }
    };

    /**
     * 약관 동의 변경 핸들러
     * - 약관 데이터 업데이트 및 상태 업데이트
     */
    const handleAgreementChange = (e, rowData) => {
        const newValue = e.target.checked ? 'Y' : 'N';
        updateUserAgreement(userData.user_uid, rowData.terms_code, rowData.terms_type, newValue);
    };

    const accountValidation = () => {
        if(!editedAccount?.bank_code) {
            setAccountError(true);
            return false;
        }
        if(!editedAccount?.acnt_linked) {
            setAccountError(true);
            return false;
        }
        if(!editedAccount?.qual_limit) {
            setAccountError(true);
            return false;
        }

        setAccountError(false);
        return true;
    };

    /**
     * DataGrid 컬럼 정의
     * - 각 탭에서 사용되는 테이블 컬럼 구성
     */

    // 상장 종목 그리드 컬럼
    const symbolColumns = [
        { field: 'symbol_name', headerName: '종목명', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'symbol_code', headerName: '종목 코드', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'trade_pos_qty', headerName: '보유 수량', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    ];

    // 공모 종목 그리드 컬럼
    const offerColumns = [
        { field: 'offer_name', headerName: '공모 종목명', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'ticker_code', headerName: '공모 종목 코드', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'offer_quantity', headerName: '공모 신청 수량', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'offer_used', headerName: '공모 종목 상태', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    ];

    // 약관 동의 그리드 컬럼
    const agreementColumns = [
        { 
            field: 'terms_agree', 
            headerName: '약관 동의 유무', 
            minWidth: 160, 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            renderCell: (params) => (
                <Checkbox checked={params.value === 'Y'} onChange={(e) => handleAgreementChange(e, params.row)} disabled={params.row.terms_required === 'Y'}
                    sx={{
                        '&.Mui-checked': {
                            color: '#405386',
                        },
                        '&.Mui-disabled': {
                            color: 'gray',
                        },
                    }}
                />
            ),
        },
        { field: 'terms_code', headerName: '약관 종류', minWidth: 80, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'terms_type', headerName: '약관 타입', minWidth: 80, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'terms_name', headerName: '약관 이름', minWidth: 250, flex: 1, headerAlign: 'center', align: 'left' },
        { field: 'terms_date', headerName: '약관 동의 일자', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'terms_file', headerName: '약관 파일', minWidth: 250, flex: 1, headerAlign: 'center', align: 'left' },
        { field: 'terms_required', headerName: '필수 여부', minWidth: 50, flex: 1, headerAlign: 'center', align: 'center' },
    ];

    /**
     * 탭 컨텐츠 렌더링
     * - 각 탭별 UI 구성
     * - 조건부 렌더링 처리
     */

    // 탭 컨텐츠 렌더링
    const renderTabContent = () => {
        switch(activeTab) {
            case 0: // 기본 정보
                return (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                            <TextField label="회원 UID" name="user_uid" value={editedUser?.user_uid || ''} onChange={handleChange} fullWidth disabled />
                            <TextField label="회원 CI" name="user_ci" value={editedUser?.user_ci || ''} onChange={handleChange} fullWidth disabled />
                            <TextField label="회원 이름" name="user_name" value={editedUser?.user_name || ''} onChange={handleChange} fullWidth />
                            <TextField label="회원 연락처" name="user_tel" value={editedUser?.user_tel || ''} onChange={handleChange} fullWidth />
                            <TextField label="회원 이메일" name="user_email" value={editedUser?.user_email || ''} onChange={handleChange} fullWidth />
                            <TextField label="회원 생년월일" name="user_birth" value={editedUser?.user_birth || ''} onChange={handleChange} fullWidth />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                            <TextField label="투자 성향 등급" name="tend_grade" value={editedUser?.tend_grade || ''} onChange={handleChange} fullWidth select slotProps={{ select: { native: true, } }}>
                                <option value="1">{CONFIG.TEND_GRADE[1]}</option>
                                <option value="2">{CONFIG.TEND_GRADE[2]}</option>
                                <option value="3">{CONFIG.TEND_GRADE[3]}</option>
                                <option value="4">{CONFIG.TEND_GRADE[4]}</option>
                                <option value="5">{CONFIG.TEND_GRADE[5]}</option>
                            </TextField>
                            <TextField label="투자 자격 등급" name="qual_grade" value={editedUser?.qual_grade || ''} onChange={handleChange} fullWidth select slotProps={{ select: { native: true, } }}>
                                <option value="1">{CONFIG.QUAL_GRADE[1]}</option>
                                <option value="2">{CONFIG.QUAL_GRADE[2]}</option>
                                <option value="3">{CONFIG.QUAL_GRADE[3]}</option>
                            </TextField>
                            <TextField label="가입 일자" name="user_join_date" value={editedUser?.rtime || ''} onChange={handleChange} fullWidth disabled />
                            <TextField label="상태" name="user_used" value={editedUser?.user_used || ''} onChange={handleChange} fullWidth select slotProps={{ select: { native: true, } }}>
                                <option value="Y">사용</option>
                                <option value="N">정지</option>
                                <option value="D">탈퇴</option>
                            </TextField>
                        </Box>
                    </>
                );
            case 1: // 계좌정보
                return (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                            <TextField label="거래용 계좌" name="acnt_list" value={selectedAccount?.acnt_cd || 'N'} onChange={handleAccountListChange} fullWidth select slotProps={{ select: { native: true,} }}>
                                <option value='N'>신규 계좌 추가</option>
                                {userAccount && Array.isArray(userAccount) && userAccount.map(account => (
                                    <option key={account.acnt_cd} value={account.acnt_cd}>{account.acnt_cd}</option>
                                ))}
                            </TextField>
                            <TextField 
                                label="연결 계좌 은행" 
                                name="bank_code" 
                                value={editedAccount?.bank_code || ''} 
                                onChange={handleAccountChange} 
                                fullWidth 
                                required
                                error={!editedAccount.bank_code && accountError}
                                helperText={!editedAccount.bank_code && accountError ? '필수 입력 항목입니다.' : ''}
                                disabled={selectedAccount.acnt_cd !== ''}
                            />
                            <TextField 
                                label="연결 계좌 번호" 
                                name="acnt_linked" 
                                value={editedAccount?.acnt_linked || ''} 
                                onChange={handleAccountChange} 
                                fullWidth 
                                required 
                                error={!editedAccount.acnt_linked && accountError}
                                helperText={!editedAccount.acnt_linked && accountError ? '필수 입력 항목입니다.' : ''}
                                disabled={selectedAccount.acnt_cd !== ''}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                            <NumericFormat
                                label="예수금"
                                name="deposit_amt"
                                value={editedAccount?.deposit_amt || ''}
                                onValueChange={(values) => {
                                    handleAccountChange({ target: { name: 'deposit_amt', value: values.value } });
                                }}
                                thousandSeparator
                                valueIsNumericString={true}
                                customInput={TextField}
                                fullWidth
                                disabled
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                    },
                                }}
                            />
                            <NumericFormat
                                label="거래용 계좌 거래 한도" 
                                name="qual_limit"
                                value={editedAccount?.qual_limit || ''}
                                onValueChange={(values) => {
                                    handleAccountChange({ target: { name: 'qual_limit', value: values.value } });
                                }}
                                thousandSeparator
                                valueIsNumericString={true}
                                customInput={TextField}
                                fullWidth
                                required
                                error={!editedAccount.qual_limit && accountError}
                                helperText={!editedAccount.qual_limit && accountError ? '필수 입력 항목입니다.' : ''}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">원</InputAdornment>,
                                    },
                                }}
                            />
                        </Box>
                    </>
                );
            case 2: // 자산
                return (
                    <Box sx={{ height: '100%', maxHeight: 500, width: '100%', display: 'flex', flexDirection: 'column'}}>
                        <RadioGroup value={assetView} onChange={handleAssetViewChange} row sx={{ mb: 1 }}>
                            <FormControlLabel 
                                value="symbol" 
                                control={<Radio />} 
                                label="상장 종목"
                                sx={{ color: 'black' }}
                            />
                            <FormControlLabel 
                                value="offer" 
                                control={<Radio />} 
                                label="공모 종목" 
                                sx={{ color: 'black' }}
                            />
                        </RadioGroup>

                        {assetView === 'symbol' && (
                            <CustomDataGrid
                                rows={symbolData}
                                columns={symbolColumns}
                                paginationModel={paginationModel}
                                onPaginationModelChange={onPaginationModelChange}
                                loading={loading}
                                error={error}
                            />
                        )}

                        {assetView === 'offer' && (
                            <CustomDataGrid
                                rows={offerData}
                                columns={offerColumns}
                                paginationModel={paginationModel}
                                onPaginationModelChange={onPaginationModelChange}
                                loading={loading}
                                error={error}
                            />
                        )}
                    </Box>
                );
            case 3: // 동의 내역
                return (
                    <CustomDataGrid
                        rows={agreementData}
                        columns={agreementColumns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={onPaginationModelChange}
                        loading={loading}
                        error={error}
                    />
                );
            default:
                return null;
        }
    };

    // 저장 버튼 표시 여부
    const showSaveButton = activeTab < 2; // 0, 1번 탭에서만 true

    return (
        <>
            <Modal className='modal' open={open} onClose={onClose} aria-labelledby="user-info-modal">
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    height: '70%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    overflow: 'hidden'
                }}>
                    {/* Modal Header */}
                    <Box sx={{ 
                        borderBottom: 1,
                        borderTopRightRadius: 8,
                        borderTopLeftRadius: 8,
                        borderColor: 'divider',
                        backgroundColor: '#405386',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant="h6" component="h2">회원 상세 정보</Typography>
                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab label="기본 정보" />
                            <Tab label="계좌 정보" />
                            <Tab label="자산" />
                            <Tab label="동의 내역" />
                        </Tabs>
                    </Box>

                    
                    {/* Content */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between', 
                        height: '100%', 
                        p: 3, 
                        pb: showSaveButton ? 0 : 3, // 버튼이 없을 때는 아래 패딩 추가
                        overflow: 'auto', 
                        flexGrow: 1
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            justifyContent: 'space-between', 
                            height: '100%', 
                            gap: 2
                        }}>
                            {renderTabContent()}
                        </Box>
                        <AlertBar alertOpen={alertOpen} handleAlertClose={handleAlertClose} message={alertMessage} type={alertType}/>
                    </Box>

                    {/* Footer - 조건부 렌더링 */}
                    {showSaveButton && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, p: 3 }}>
                            <Button onClick={onClose} variant="contained">
                                취소
                            </Button>
                            <Button onClick={handleSave} variant="contained">
                                저장
                            </Button>
                        </Box>
                    )}
                </Box>
            </Modal>
            <LoadingIndicator open={loading} />
        </>
    );
};

export default UserDetailModal; 