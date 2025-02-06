
const CONSTANT = {
    // 에러 메세지류
    ERROR_MESSAGE: {
        // common
        NO_DATA: '조회된 데이터가 없습니다.',
        FAILED_UPDATE: '정보 수정에 실패했습니다.',
        FAILED_GET_MASTER_DATA: '마스터 데이터를 불러오는데 실패했습니다.',

        // 회원관련
        NO_DIFFERENT_USER_DATA: '변경된 회원 정보가 없습니다.',
        FAILED_GET_USER_INFORMATION: '회원 정보 조회에 실패했습니다.',
        FAILED_GET_USER_SYMBOL: '회원 종목 조회에 실패했습니다.',
        FAILED_GET_USER_OFFER: '회원 공모 조회에 실패했습니다.',
        FAILED_GET_USER_AGREEMENT: '회원 약관 조회에 실패했습니다.',
        FAILED_GET_USER_ACCOUNT: '회원 계좌 조회에 실패했습니다.',
        FAILED_UPDATE_USER_INFORMATION: '회원 정보 수정에 실패했습니다.',
        FAILED_REGISTER_USER_ACCOUNT: '계좌 등록에 실패했습니다.'
    },

    // 성공 메세지류
    SUCCESS_MESSAGE: {
        // common
        UPDATE_SUCCESS: '정보 수정이 완료되었습니다.',

        // 회원관련
        UPDATE_USER_INFORMATION: '회원 정보가 업데이트되었습니다.',
        UPDATE_USER_ACCOUNT: '계좌 정보가 업데이트되었습니다.',
        UPDATE_USER_SYMBOL: '종목 정보가 업데이트되었습니다.',
        UPDATE_USER_OFFER: '공모 정보가 업데이트되었습니다.',
        UPDATE_USER_AGREEMENT: '약관 정보가 업데이트되었습니다.',
        REGISTER_USER_ACCOUNT: '계좌 정보가 등록되었습니다.',
    }
}

export default CONSTANT;