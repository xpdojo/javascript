# GraphQL 간단한 예제

Node.js를 활용한 간단한 GraphQL 서버 예제입니다.

## 설치

```shell
npm install
```

## 실행

```shell
npm start
```

또는 개발 모드 (자동 재시작):

```shell
npm run dev
```

## 사용 방법

서버가 시작되면 브라우저에서 다음 URL로 접속:

- **사용자 화면**: http://localhost:4000/
- **GraphQL 엔드포인트**: http://localhost:4000/graphql

## GraphQL 쿼리 예제

### 1. Hello 쿼리

```graphql
query {
  hello
}
```

### 2. 사용자 조회

```graphql
query {
  user(id: 1) {
    id
    name
    email
  }
}
```

### 3. 모든 사용자 조회

```graphql
query {
  users {
    id
    name
    email
  }
}
```
