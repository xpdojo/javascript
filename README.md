# Javascript

## Install

- [nodejs/snap](https://github.com/nodejs/snap#installation)
  - [snap](https://nodejs.org/en/download/package-manager/#snap)

```sh
sudo snap find node
# Name                             Version                           Publisher               Notes    Summary
# node                             18.13.0                           iojs✓                   classic  Node.js
```

```sh
sudo snap info node
# channels:
#   18/stable:        18.13.0                        2023-01-06 (7065) 32MB classic
```

```sh
sudo snap install node --classic --channel=18
```

이미 설치되어 있다면 refresh로 업데이트한다.

```sh
sudo snap refresh node --classic --channel=18
```

만약 실행중인 프로세스가 있다면 다음과 같이 중지한다.

```sh
error: cannot refresh "node": snap "node" has running apps (node), pids:
       959628,1030492,1048108,1055481
```

```sh
# graceful shutdown
sudo kill -TERM 959628 1030492 1048108 1055481
# force shutdown
sudo kill -KILL 1055481
```

이후 다시 refresh한다.

```sh
node --version
# v18.13.0
```
