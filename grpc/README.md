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

## 테스트 시나리오

QA 테스트는 다음 시나리오를 검증합니다:

1. ✅ Add: 10 + 5 = 15
2. ✅ Subtract: 10 - 5 = 5
3. ✅ Multiply: 10 * 5 = 50
4. ✅ Divide: 10 / 5 = 2
5. ✅ Divide by Zero: 10 / 0 (에러 처리 확인)

## 기술 스택

- **Node.js**: JavaScript 런타임
- **@grpc/grpc-js**: gRPC JavaScript 구현
- **@grpc/proto-loader**: Protocol Buffers 로더
- **Protocol Buffers**: 서비스 정의 및 메시지 직렬화

## 포트

기본 포트: **50051**

포트를 변경하려면 `server.js`와 `client.js`에서 포트 번호를 수정하세요.
