import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { transactionAPI } from '../api/api';

const PageContainer = styled.div`
    padding: 20px;
`;

const SearchBar = styled.div`
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        display: block;

        thead {
            display: none;
        }

        tbody,
        tr,
        td {
            display: block;
            width: 100%;
        }

        tr {
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
        }

        td {
            text-align: right;
            padding-left: 50%;
            position: relative;

            &:before {
                content: attr(data-label);
                position: absolute;
                left: 0;
                width: 50%;
                padding-left: 15px;
                font-weight: bold;
                text-align: left;
            }
        }
    }
`;

const DepositWithdrawPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        customerName: '',
        startDate: '',
        endDate: '',
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionAPI.getTransactions(filters);
            setTransactions(response.data);
        } catch (error) {
            console.error('거래 내역 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <PageContainer>
            <h2>입출금 관리</h2>

            <SearchBar>
                <input type="text" placeholder="고객명" value={filters.customerName} onChange={(e) => setFilters({ ...filters, customerName: e.target.value })} />
                <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                <button onClick={fetchTransactions}>검색</button>
            </SearchBar>

            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <th>신청일</th>
                            <th>처리일</th>
                            <th>구분</th>
                            <th>계좌번호</th>
                            <th>금액</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td data-label="신청일">{transaction.requestDate}</td>
                                <td data-label="처리일">{transaction.processDate}</td>
                                <td data-label="구분">{transaction.type}</td>
                                <td data-label="계좌번호">{transaction.accountNumber}</td>
                                <td data-label="금액">{transaction.amount.toLocaleString()}원</td>
                                <td data-label="상태">{transaction.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </PageContainer>
    );
};

export default DepositWithdrawPage;
