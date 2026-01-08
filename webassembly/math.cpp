#include <emscripten.h>

extern "C" {
    // EMSCRIPTEN_KEEPALIVE는 이 함수가 삭제되지 않고
    // 자바스크립트에서 호출될 수 있도록 유지하라는 명령입니다.
    EMSCRIPTEN_KEEPALIVE
    int square(int n) {
        return n * n;
    }
}
