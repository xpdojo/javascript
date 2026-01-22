import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 씬 설정
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a2a);

// 카메라 설정
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

// 렌더러 설정
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false; // 성능 향상을 위해 shadow 비활성화
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 디스플레이 최적화
document.getElementById('canvas-container').appendChild(renderer.domElement);

// OrbitControls 설정 (마우스 상호작용)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 50;

// 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = false; // 성능 향상을 위해 shadow 비활성화
scene.add(directionalLight);

// 추가 조명 (더 나은 조명을 위해)
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// 그리드 헬퍼 (선택사항)
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
scene.add(gridHelper);

// 축 헬퍼 (선택사항)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// GLTF/GLB 로더
let loader = new GLTFLoader();
let currentModel = null;
let createdUrls = []; // 생성된 Blob URL 추적 (메모리 정리용)

// Vertex, Edge 표시 관련
let edgeHelpers = new Map(); // 메시별 edge helper
let vertexHelpers = new Map(); // 메시별 vertex helper
let showEdges = false;
let showVertices = false;

// 모델 로드 함수
function loadModel(url, customLoader = null) {
  const loadingElement = document.getElementById('loading');
  loadingElement.classList.add('show');

  const activeLoader = customLoader || loader;

  activeLoader.load(
    url,
    (gltf) => {
      // 이전 모델 제거
      if (currentModel) {
        scene.remove(currentModel);
        // 모델의 모든 메시와 조명 정리
        currentModel.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }

      // 이전 헬퍼들 제거
      edgeHelpers.forEach((helper, mesh) => {
        if (mesh.parent) {
          mesh.remove(helper);
        }
        helper.geometry.dispose();
        helper.material.dispose();
      });
      vertexHelpers.forEach((helper, mesh) => {
        if (mesh.parent) {
          mesh.remove(helper);
        }
        helper.geometry.dispose();
        helper.material.dispose();
      });
      edgeHelpers.clear();
      vertexHelpers.clear();

      // 새 모델 추가
      currentModel = gltf.scene;
      scene.add(currentModel);

      // 헬퍼는 필요할 때만 생성하도록 변경 (지연 로딩)

      // 모델의 바운딩 박스 계산
      const box = new THREE.Box3().setFromObject(currentModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // 모델을 원점으로 이동
      currentModel.position.x += (currentModel.position.x - center.x);
      currentModel.position.y += (currentModel.position.y - center.y);
      currentModel.position.z += (currentModel.position.z - center.z);

      // 카메라 위치 조정
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5; // 여유 공간 추가

      camera.position.set(0, 0, cameraZ);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();

      loadingElement.classList.remove('show');
      console.log('모델 로드 완료:', gltf);
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log('로딩 진행률:', percent.toFixed(2) + '%');
    },
    (error) => {
      loadingElement.classList.remove('show');
      console.error('모델 로드 실패:', error);
      alert('모델을 로드하는 중 오류가 발생했습니다: ' + error.message);
    }
  );
}

// GLTF 파일 처리 함수 (외부 리소스 포함)
async function loadGLTFFile(gltfFile, fileList) {
  const loadingElement = document.getElementById('loading');
  loadingElement.classList.add('show');

  try {
    // 이전에 생성된 URL 정리
    createdUrls.forEach(url => URL.revokeObjectURL(url));
    createdUrls = [];

    // GLTF 파일을 텍스트로 읽기
    const gltfText = await gltfFile.text();
    const gltfJson = JSON.parse(gltfText);

    // 파일 리소스 맵 생성 (파일명을 키로 사용)
    const fileMap = new Map();

    // 모든 파일을 맵에 저장 (파일명을 소문자로 변환하여 저장)
    Array.from(fileList).forEach(file => {
      fileMap.set(file.name.toLowerCase(), file);
      // 원본 파일명도 저장 (대소문자 구분)
      if (file.name.toLowerCase() !== file.name) {
        fileMap.set(file.name, file);
      }
    });

    // GLTF JSON에서 참조하는 리소스를 찾아서 Blob URL로 변환
    const resourceUrlMap = new Map();

    const processResource = (uri) => {
      if (!uri) return null;

      // 절대 URL이면 그대로 반환
      if (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('data:')) {
        return uri;
      }

      // 상대 경로에서 파일명 추출
      const fileName = uri.split('/').pop().split('\\').pop();

      // 파일명으로 파일 찾기 (대소문자 구분 없이)
      let file = fileMap.get(fileName.toLowerCase());
      if (!file) {
        file = fileMap.get(fileName);
      }

      if (file) {
        const fileUrl = URL.createObjectURL(file);
        createdUrls.push(fileUrl);
        resourceUrlMap.set(uri, fileUrl);
        return fileUrl;
      }

      console.warn('리소스 파일을 찾을 수 없습니다:', uri);
      return null;
    };

    // 버퍼 처리
    if (gltfJson.buffers) {
      gltfJson.buffers.forEach((buffer) => {
        if (buffer.uri) {
          processResource(buffer.uri);
        }
      });
    }

    // 이미지 처리
    if (gltfJson.images) {
      gltfJson.images.forEach((image) => {
        if (image.uri) {
          processResource(image.uri);
        }
      });
    }

    // GLTF 파일을 Blob URL로 변환
    const gltfBlob = new Blob([gltfText], { type: 'application/json' });
    const gltfUrl = URL.createObjectURL(gltfBlob);
    createdUrls.push(gltfUrl);

    // 커스텀 로더 생성 (리소스 URL 매핑 적용)
    const customLoader = new GLTFLoader();

    // 리소스 URL 해결 함수 오버라이드
    const originalResolveURL = customLoader.manager.resolveURL.bind(customLoader.manager);
    customLoader.manager.resolveURL = function (url) {
      // 리소스 맵에 있으면 해당 URL 반환
      if (resourceUrlMap.has(url)) {
        return resourceUrlMap.get(url);
      }

      // 상대 경로에서 파일명 추출하여 찾기
      const fileName = url.split('/').pop().split('\\').pop();
      let file = fileMap.get(fileName.toLowerCase());
      if (!file) {
        file = fileMap.get(fileName);
      }

      if (file) {
        const fileUrl = URL.createObjectURL(file);
        createdUrls.push(fileUrl);
        resourceUrlMap.set(url, fileUrl);
        return fileUrl;
      }

      // 기본 동작
      return originalResolveURL(url);
    };

    // 모델 로드
    loadModel(gltfUrl, customLoader);

  } catch (error) {
    loadingElement.classList.remove('show');
    console.error('GLTF 파일 처리 실패:', error);
    alert('GLTF 파일을 처리하는 중 오류가 발생했습니다: ' + error.message);

    // 에러 발생 시 생성된 URL 정리
    createdUrls.forEach(url => URL.revokeObjectURL(url));
    createdUrls = [];
  }
}

// 파일 입력 처리
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  // GLTF 파일 찾기
  const gltfFile = Array.from(files).find(file =>
    file.name.toLowerCase().endsWith('.gltf')
  );

  // GLB 파일 찾기
  const glbFile = Array.from(files).find(file =>
    file.name.toLowerCase().endsWith('.glb')
  );

  if (gltfFile) {
    // GLTF 파일 처리 (외부 리소스 포함)
    await loadGLTFFile(gltfFile, files);
  } else if (glbFile) {
    // GLB 파일 처리 (단일 파일)
    const url = URL.createObjectURL(glbFile);
    loadModel(url);
  } else {
    alert('GLTF 또는 GLB 파일을 선택해주세요.');
  }
});

// Vertex, Edge 표시 토글 함수
function toggleEdges() {
  showEdges = !showEdges;
  updateModelDisplay();
  document.getElementById('edges-toggle').classList.toggle('active', showEdges);
}

function toggleVertices() {
  showVertices = !showVertices;
  updateModelDisplay();
  document.getElementById('vertices-toggle').classList.toggle('active', showVertices);
}

// UI 컨트롤 이벤트 리스너
document.getElementById('edges-toggle').addEventListener('click', toggleEdges);
document.getElementById('vertices-toggle').addEventListener('click', toggleVertices);

// 샘플 모델 로드 (선택사항 - public 폴더에 모델이 있다면)
// loadModel('/models/sample.glb');

// 모델 헬퍼 생성 함수 (필요할 때만 생성 - 지연 로딩)
function createEdgeHelper(mesh) {
  if (edgeHelpers.has(mesh)) {
    return edgeHelpers.get(mesh);
  }
  
  const geometry = mesh.geometry;
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    linewidth: 1
  });
  const edgesLine = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  mesh.add(edgesLine);
  edgeHelpers.set(mesh, edgesLine);
  return edgesLine;
}

function createVertexHelper(mesh) {
  if (vertexHelpers.has(mesh)) {
    return vertexHelpers.get(mesh);
  }
  
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;
  if (!positions) return null;
  
  // 너무 많은 vertex가 있는 경우 샘플링 (성능 최적화)
  const vertexCount = positions.count;
  let vertexSize = 0.02; // 기본 크기를 줄임
  
  // vertex가 10000개 이상이면 크기를 더 줄이고 샘플링
  if (vertexCount > 10000) {
    vertexSize = 0.01;
    // 간단한 샘플링: 매 N번째 vertex만 사용
    const sampleRate = Math.ceil(vertexCount / 10000);
    const sampledPositions = new Float32Array(Math.ceil(vertexCount / sampleRate) * 3);
    let index = 0;
    for (let i = 0; i < vertexCount; i += sampleRate) {
      sampledPositions[index++] = positions.getX(i);
      sampledPositions[index++] = positions.getY(i);
      sampledPositions[index++] = positions.getZ(i);
    }
    const verticesGeometry = new THREE.BufferGeometry();
    verticesGeometry.setAttribute('position', new THREE.BufferAttribute(sampledPositions, 3));
    const verticesMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: vertexSize,
      sizeAttenuation: true
    });
    const verticesPoints = new THREE.Points(verticesGeometry, verticesMaterial);
    mesh.add(verticesPoints);
    vertexHelpers.set(mesh, verticesPoints);
    return verticesPoints;
  }
  
  const verticesGeometry = new THREE.BufferGeometry();
  verticesGeometry.setAttribute('position', positions);
  const verticesMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: vertexSize,
    sizeAttenuation: true
  });
  const verticesPoints = new THREE.Points(verticesGeometry, verticesMaterial);
  mesh.add(verticesPoints);
  vertexHelpers.set(mesh, verticesPoints);
  return verticesPoints;
}

// 모델 표시 업데이트 함수 (필요할 때만 헬퍼 생성)
function updateModelDisplay() {
  if (!currentModel) return;
  
  currentModel.traverse((child) => {
    if (child.isMesh) {
      // 원본 메시는 항상 표시
      child.visible = true;
      
      // Edge 표시 (필요할 때만 생성)
      if (showEdges) {
        const edges = createEdgeHelper(child);
        if (edges) {
          edges.visible = true;
        }
      } else {
        const edges = edgeHelpers.get(child);
        if (edges) {
          edges.visible = false;
        }
      }
      
      // Vertex 표시 (필요할 때만 생성)
      if (showVertices) {
        const vertices = createVertexHelper(child);
        if (vertices) {
          vertices.visible = true;
        }
      } else {
        const vertices = vertexHelpers.get(child);
        if (vertices) {
          vertices.visible = false;
        }
      }
    }
  });
}

// 윈도우 리사이즈 처리
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// 애니메이션 시작
animate();
