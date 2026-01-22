# Three.js GLB Viewer

Three.js를 활용하여 Blender 파일(GLB/GLTF)을 로드하고 렌더링하며 상호작용할 수 있는 프로젝트입니다.

## 기능

- GLB/GLTF 파일 로드 및 렌더링
- 마우스 상호작용:
  - 왼쪽 클릭 + 드래그: 모델 회전
  - 오른쪽 클릭 + 드래그: 카메라 패닝
  - 마우스 휠: 줌 인/아웃
- 자동 카메라 위치 조정
- 조명 및 그림자 지원

## 설치

```bash
pnpm install
```

## 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`이 자동으로 열립니다.

## 사용 방법

1. 개발 서버를 실행합니다.
2. "GLB 파일 선택" 버튼을 클릭하여 GLB 또는 GLTF 파일을 선택합니다.
3. 모델이 로드되면 마우스로 상호작용할 수 있습니다.

## 빌드

```bash
pnpm build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 미리보기

```bash
pnpm preview
```

## 기술 스택

- [Three.js](https://threejs.org/) - 3D 그래픽 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 도구 및 개발 서버
- [pnpm](https://pnpm.io/) - 패키지 매니저

## 참고 자료 및 출처

- [KhronosGroup/glTF-Sample-Viewer](https://github.com/KhronosGroup/glTF-Sample-Viewer) | Khronos Group
  - [샘플 모델 출처](https://github.com/KhronosGroup/glTF-Sample-Models)
- [웹 3D 모델 최적화 기법 소개](https://d2.naver.com/helloworld/6152907) | NAVER D2
