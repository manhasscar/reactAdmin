import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Alert,
} from '@mui/material';
import { MoreVert as MoreVertIcon, } from '@mui/icons-material';
import { userAPI } from '../../api/api';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import UserDetailModal from '../../components/user/UserDetailModal';
import { MasterDataContext } from '../../contexts/MasterDataContext';

const UserManagementPage = () => {
    //종목, 상품, 거래소 마스터 데이터
    const { symbols, products, excs } = useContext(MasterDataContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [nextKey, setNextKey] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 0,
    });

    const getUsers = async (isNext = false) => {
        try {
            setLoading(true);
            let localNextKey = null;
            if(isNext) {
                localNextKey = nextKey;
            }
            const response = await userAPI.getUsers(searchName, localNextKey);
            const mappedUsers = await response.OutBlock1.map(user => ({
                ...user,
                id: user.user_uid
            }));

            const lastUser = response.OutBlock1[response.OutBlock1.length - 1];
            setNextKey(lastUser?.next_key || null);

            console.log(response);
            console.log(isNext);

            if(isNext) {
                setUsers(prevUsers => [...prevUsers, ...mappedUsers]);
                setPaginationModel(prev => ({
                    ...prev,
                    page: Math.floor(users.length / prev.pageSize)
                }));
            } else {
                setUsers(mappedUsers);
                setPaginationModel(prev => ({
                    ...prev,
                    page: 0
                }));
            }
            
            setError(null);
        } 
        catch(error) {
            console.error('유저 조회 실패:', error);
            setError('사용자 정보를 불러오는데 실패했습니다.');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
        console.log(symbols);
        console.log(products);
        console.log(excs);
    }, []);

    const columns = [
        { field: 'user_name', headerName: '고객 이름', minWidth: 120, flex: 1, headerAlign: 'center', align: 'left' },
        { field: 'user_birth', headerName: '생년월일', minWidth: 150, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'user_tel', headerName: '전화번호', minWidth: 150, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'user_email', headerName: '이메일', minWidth: 130, flex: 1, headerAlign: 'center', align: 'left' },
        { field: 'user_used', headerName: '상태', minWidth: 80, flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'actions', headerName: '관리', minWidth: 100, flex: 1, sortable: false, headerAlign: 'center', align: 'center', renderCell: (params) => (
            <IconButton onClick={() => handleOpenModal(params.row)}>
                <MoreVertIcon />
            </IconButton>
        )},
    ];                  

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSave = (editedUserData) => {
        // 수정된 데이터로 해당 row만 업데이트
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === editedUserData.user_uid 
                    ? { ...user, ...editedUserData }
                    : user
            )
        );
    };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            setUsers([]); // 검색 시 데이터 초기화
            getUsers();
        }
    };

    const handleNextClick = async () => {
        await getUsers(true);
    };

    // 검색 시에는 next_key와 기존 데이터 초기화
    const handleSearch = () => {
        setUsers([]); // 검색 시 데이터 초기화
        getUsers();
    };

    return (
        <>
            <Box sx={{ height: '100%', width: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    회원 관리
                </Typography>
            
                {error && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                        {error}
                    </Alert>
                )}
            
                <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: 2, pb: 7 }}> 
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', height: '40px', gap: 1 }}>
                        <TextField
                            placeholder="고객 이름으로 검색"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            onKeyDown={handleKeyPress}
                            size="small"
                            sx={{ maxWidth: 300,
                                '& .MuiInputBase-root': {
                                    backgroundColor: 'var(--input-bg-color)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'var(--placeholder-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--border-color)'
                                }
                            }}
                        />
                        <Button sx={{ height: '100%' }} variant="contained" onClick={handleSearch}>
                            검색
                        </Button>
                        <Button sx={{ height: '100%' }} variant="contained" onClick={handleNextClick} disabled={!nextKey}>
                            다음
                        </Button>
                    </Box>

                    <CustomDataGrid
                        rows={users}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        error={error}
                    />
                </Box>

                <UserDetailModal 
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    userData={selectedUser}
                    onSave={handleSave}
                    symbolData={users}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    error={error}
                />
            </Box>
        </> 
    );
};

export default UserManagementPage; 