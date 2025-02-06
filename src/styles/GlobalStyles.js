import { createGlobalStyle } from 'styled-components';

/**
 * 전역 스타일 정의
 * - 기본 리셋
 * - 폰트 설정
 * - 공통 컴포넌트 스타일
 */
const GlobalStyles = createGlobalStyle`
  /* 기본 리셋 */
  @import url('//fonts.googleapis.com/earlyaccess/notosanskr.css');
  @import url('//fonts.googleapis.com/earlyaccess/nanumsquareround.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 루트 변수 설정 */
  :root {
    --primary-color: #646cff;
    --primary-hover: #535bf2;
    --text-hover: #ffffff;
    --text-color: #213547;
    --text-warning: #b10f0f;
    --bg-color: #ffffff;
    --header-height: 64px;
    --input-bg-color: #ffffff;
    --placeholder-color: #242424;
    --border-color: #242424;
  }

  /* 기본 스타일 */
  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color: var(--text-color);
    background-color: var(--bg-color);
    margin: 0;
    min-width: 320px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  /* 링크 스타일 */
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: var(--primary-hover);
    }
  }

  /* 입력 요소 공통 스타일 */
  input, button {
    font-family: inherit;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 0.6em 1.2em;
  }

  /* 버튼 공통 스타일 */
  button {
    background-color: var(--primary-color);
    color: white;
    cursor: pointer;
    border: none;
    font-weight: 500;
    transition: background-color 0.25s;

    &:hover:not(:focus) {
      background-color: var(--primary-hover);
      color: var(--text-hover);
    }

    &:focus {
      outline: none;
    }
  }

  /* 테이블 공통 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
  }

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    :root {
      height: 100vh;
      width: 100vw;
      --header-height: 56px;
    }

    body {
      font-size: 14px;
    }

    table {
      th, td {
        padding: 8px;
      }
    }

    .modal {
        width: 80%;  /* 태블릿에서는 조금 더 넓게 */
        max-width: 500px;
    }
  }

  /* 모바일 (480px 이하) */
  @media (max-width: 480px) {
      :root {
        height: 100vh;
        width: 100vw;
      }
      .modal {
          width: 90%; /* 모바일에서는 거의 꽉 차도록 */
      }
  }

  /* 다크 모드 지원 */
  @media (prefers-color-scheme: dark) {
    :root {
      --text-hover: #ffffff;
      --text-color: #ffffff;
      --border-color: #ffffff;
      --input-bg-color: #ffffff;
      --bg-color: #242424;
      --placeholder-color: #242424;
    }

    button {
      background-color: #1a1a1a;
    }
  }
`;

export default GlobalStyles;
