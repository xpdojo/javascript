# WebSocket Chat Application

- [WebSocket Chat Application](#websocket-chat-application)
  - [PostgreSQL](#postgresql)
  - [Chat Application](#chat-application)
  - [k6 load test](#k6-load-test)
    - [k6 설치](#k6-설치)
    - [부하 테스트 실행](#부하-테스트-실행)
    - [테스트 설정](#테스트-설정)
    - [메트릭](#메트릭)

## PostgreSQL

```shell
sudo docker compose up -d
# sudo docker exec postgres cat /var/lib/postgresql/data/postgresql.conf > postgres/postgresql.conf.sample
```

## Chat Application

```sh
npm install
```

```sh
npm start
```

## k6 load test

### k6 설치

```sh
brew install k6
```

### 부하 테스트 실행

```sh
# 기본 테스트 실행 (최대 100명의 VU)
k6 run websocket-load-test.js

# 더 많은 VU(가상 사용자)로 테스트
k6 run --vus 200 --duration 2m websocket-load-test.js

# 결과를 JSON 파일로 저장
k6 run --out json=results.json websocket-load-test.js
```

### 테스트 설정

현재 테스트는 다음 단계로 진행됩니다:
- 10초: 10명의 사용자로 증가
- 30초: 50명의 사용자로 증가
- 30초: 100명의 사용자로 증가
- 30초: 50명으로 감소
- 10초: 0명으로 감소

### 메트릭

테스트는 다음 메트릭을 추적합니다:
- `connections_successful`: 연결 성공률
- `messages_sent`: 메시지 전송 성공률
- `ws_connecting`: 연결 시간
- `ws_session_duration`: 세션 지속 시간
- `message_latency`: 메시지 지연 시간
