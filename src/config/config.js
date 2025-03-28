const CONFIG = {
    DEV: {
        API_URL: 'http://172.30.1.22:80',
    },
    PROD: {
        API_URL: 'http://172.30.1.22:80',
    },
    // 어드민 레벨
    ADMIN_LEVEL: {
        'S': '시스템 총괄 관리자',
        'O': '운영 관리자',
        'C': '고객지원 관리자'
    },
    // 투자 유형
    TEND_GRADE: {
        '1': '안정형',
        '2': '안정추구형',
        '3': '위험중립형',
        '4': '적극투자형',
        '5': '공격투자형',
    },
    // 투자자 등급
    QUAL_GRADE: {
        '1': '일반 투자자',
        '2': '소득적격 투자자',
        '3': '전문 투자자',
    },
};

export default CONFIG;