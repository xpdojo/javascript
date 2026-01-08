const canvas = document.querySelector("#glCanvas");

// WebGLRenderingContext
const gl = canvas.getContext("webgl");
console.log(gl);

if (!gl) {
  alert("WebGL을 지원하지 않는 브라우저입니다.");
}

// 1. Vertex Shader: 회전 변환 포함
const vsSource = `
  attribute vec4 aVertexPosition;
  uniform float uRotation;
  void main() {
    float cosR = cos(uRotation);
    float sinR = sin(uRotation);
    mat2 rotation = mat2(cosR, -sinR, sinR, cosR);
    vec2 rotated = rotation * aVertexPosition.xy;
    gl_Position = vec4(rotated, 0.0, 1.0);
  }
`;

// 2. Fragment Shader: 동적 색상
const fsSource = `
  precision mediump float;
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

// 셰이더 컴파일 함수
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('셰이더 컴파일 오류:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

// 프로그램 생성 및 링크
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error('프로그램 링크 오류:', gl.getProgramInfoLog(shaderProgram));
}

gl.useProgram(shaderProgram);

// 3. 삼각형 데이터 설정
const vertices = new Float32Array([
  0.0, 0.5,
  -0.5, -0.5,
  0.5, -0.5,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// GPU에 데이터 전달
const pos = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

// 유니폼 변수 위치 가져오기
const rotationLocation = gl.getUniformLocation(shaderProgram, 'uRotation');
const colorLocation = gl.getUniformLocation(shaderProgram, 'uColor');

// 상태 변수
let rotation = 0;
const colors = [
  [1.0, 0.0, 1.0], // 분홍색
  [0.0, 1.0, 1.0], // 청록색
  [1.0, 1.0, 0.0], // 노란색
  [1.0, 0.0, 0.0], // 빨간색
  [0.0, 1.0, 0.0], // 초록색
  [0.0, 0.0, 1.0], // 파란색
];
let colorIndex = 0;

// 마우스 이벤트: 회전 제어
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // 마우스 위치를 회전 각도로 변환
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const angle = Math.atan2(y - centerY, x - centerX);
  rotation = angle;
});

// 클릭 이벤트: 색상 변경
canvas.addEventListener('click', () => {
  colorIndex = (colorIndex + 1) % colors.length;
});

// 렌더링 함수
function render() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 회전 각도 전달
  gl.uniform1f(rotationLocation, rotation);
  
  // 색상 전달
  const currentColor = colors[colorIndex];
  gl.uniform3fv(colorLocation, currentColor);

  // 삼각형 그리기
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(render);
}

// 애니메이션 시작
render();
