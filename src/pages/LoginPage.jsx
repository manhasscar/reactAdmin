import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authAPI } from '../api/api';
import { setToken } from '../utils/auth';

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const LoginForm = styled.form`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        adminId: '',
        adminPass: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.login(formData.adminId, formData.adminPass);
            setToken(response.OutBlock1[0]);
            navigate('/');
        } catch (error) {
            console.error('로그인 실패:', error);
            setError('로그인에 실패했습니다.');
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <h2>관리자 로그인</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <input type="text" placeholder="아이디" value={formData.adminId} onChange={(e) => setFormData({ ...formData, adminId: e.target.value })} />
                <input type="password" placeholder="비밀번호" value={formData.adminPass} onChange={(e) => setFormData({ ...formData, adminPass: e.target.value })} />
                <button type="submit">로그인</button>
            </LoginForm>
        </LoginContainer>
    );
};

export default LoginPage;
