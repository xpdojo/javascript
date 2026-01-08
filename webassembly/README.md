# WebAssembly with Emscripten

## emscripten 설치

Homebrew 사용해서 설치

```sh
brew install emscripten
```

혹은 직접 빌드

```sh
git clone https://github.com/emscripten-core/emsdk
cd emsdk
./emsdk install latest
./emsdk activate latest
```

## C++ 코드를 WebAssembly로 컴파일

```sh
emcc math.cpp -o wasm/math.js -s EXPORTED_FUNCTIONS='["_square"]'
# math.js와 math.wasm 파일이 생성
```

## 로컬 서버 실행해서 확인

```sh
live-server .
```
