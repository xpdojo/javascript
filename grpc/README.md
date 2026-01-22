# Node.js gRPC 예제

Node.js를 사용한 간단한 gRPC 계산기 서비스 예제입니다.

## 프로젝트 구조

```
.
├── calculator.proto    # gRPC 서비스 정의 (Protocol Buffers)
├── server.js           # gRPC 서버 구현
├── client.js           # gRPC 클라이언트 구현
├── test.js             # 자동화된 QA 테스트
├── package.json        # 프로젝트 의존성
└── README.md           # 프로젝트 문서
```

## 기능

계산기 서비스는 다음 4가지 연산을 제공합니다:
- **Add**: 두 숫자를 더하기
- **Subtract**: 두 숫자를 빼기
- **Multiply**: 두 숫자를 곱하기
- **Divide**: 두 숫자를 나누기 (0으로 나누기 방지)

## 설치

```bash
npm install
```

## 사용 방법

### 1. 서버 실행

```bash
npm start
```

서버는 포트 50051에서 실행됩니다.

### 2. 클라이언트 실행

```bash
npm run client
```

### 3. 자동화된 QA 테스트 실행

서버와 클라이언트를 자동으로 실행하고 테스트합니다:

```bash
npm test
```

## 포트

기본 포트: **50051**

포트를 변경하려면 `server.js`와 `client.js`에서 포트 번호를 수정하세요.
