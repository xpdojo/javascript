# 간단한 기능 테스트

## http-server

```sh
npm install -g http-server
```

```sh
http-server -p 5500
```

## live-server

VS Code의 Live Server Extension과 동일.
reload 기능에 websocket을 사용해서 B/F Cache를 테스트할 수 없음.

```sh
# https://github.com/tapio/live-server
npm install --global live-server
```

```sh
live-server --port=5500
```
