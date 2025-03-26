# Javascript

- [Javascript](#javascript)
  - [NVM으로 버전 관리하기](#nvm으로-버전-관리하기)
    - [Linux, macOS](#linux-macos)
    - [Windows](#windows)
  - [deprecated: Package 직접 설치](#deprecated-package-직접-설치)
    - [Ubuntu 22.04](#ubuntu-2204)
    - [Windows 11](#windows-11)
    - [macOS](#macos)
  - [deprecated: nodeenv를 사용하여 가상 환경 만들기](#deprecated-nodeenv를-사용하여-가상-환경-만들기)

## NVM으로 버전 관리하기

- Node.js v22.14.0 기준
- [공식 문서](https://nodejs.org/en/download) 참조
  - [nvm](https://github.com/nvm-sh/nvm)

### Linux, macOS

```sh
# Download and install fnm:
curl -o- https://fnm.vercel.app/install | bash

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v
```

### Windows

```powershell
# Download and install fnm:
winget install Schniz.fnm

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v
```

## deprecated: Package 직접 설치

### Ubuntu 22.04

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

### Windows 11

```ps1
choco install nodejs --version=18.14.1
```

```ps1
scoop install nodejs18
```

### macOS

```sh
brew install node@18
```

## deprecated: nodeenv를 사용하여 가상 환경 만들기

- [ekalinin/nodeenv](https://github.com/ekalinin/nodeenv)

```sh
python3 -m venv venv
source venv/bin/activate
```

```sh
(venv) pip install nodeenv
# nodeenv --version
```

- 설치 가능한 버전 확인

```sh
nodeenv --list
```

- 특정 버전 설치

```sh
# nodeenv --node=$VERSION $DEST_DIR
nodeenv --node=21.6.2 env
```

```sh
(env) (venv) source env/bin/activate
```

```sh
node --version
# v21.6.2
```

만약 다음과 같은 에러가 발생한다면
[오래된 OS 버전](https://github.com/nodejs/node/issues/43246)이나
GLIBC 라이브러리를 사용하고 있는 것이다.

```sh
# node: /lib64/libm.so.6: version `GLIBC_2.27' not found (required by node)
# node: /lib64/libc.so.6: version `GLIBC_2.28' not found (required by node)
```

```sh
ldd --version
# ldd (GNU libc) 2.26
```
