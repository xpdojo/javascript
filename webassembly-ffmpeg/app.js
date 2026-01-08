import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// DOM이 로드될 때까지 대기 (모듈 스크립트는 defer처럼 동작하므로 즉시 실행 가능)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

async function initApp() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const qualitySlider = document.getElementById('qualitySlider');
  const qualityValue = document.getElementById('qualityValue');
  const compressBtn = document.getElementById('compressBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const progressContainer = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const status = document.getElementById('status');

  let selectedFile = null;
  let compressedBlob = null;
  let ffmpegLoaded = false;
  const ffmpeg = new FFmpeg();

  // FFmpeg 로드
  async function loadFFmpeg() {
    try {
      showStatus('FFmpeg 로딩 중...', 'info');
      
      // Vite에서 node_modules를 참조하는 방법
      // 절대 경로를 사용하여 Vite 서버에서 직접 접근
      const baseURL = '/node_modules/@ffmpeg/core/dist/esm';
      
      console.log('Loading FFmpeg from:', baseURL);
      
      ffmpeg.on('log', ({ message }) => {
        console.log(message);
      });
      ffmpeg.on('progress', ({ progress, time }) => {
        const percent = Math.round(progress * 100);
        updateProgress(percent, `처리 중... ${percent}%`);
      });
      
      const coreURL = `${baseURL}/ffmpeg-core.js`;
      const wasmURL = `${baseURL}/ffmpeg-core.wasm`;
      
      console.log('Core URL:', coreURL);
      console.log('WASM URL:', wasmURL);
      
      // 파일이 존재하는지 먼저 확인
      try {
        const coreResponse = await fetch(coreURL);
        if (!coreResponse.ok) {
          throw new Error(`Core file not found: ${coreResponse.status}`);
        }
        console.log('Core file found');
        
        const wasmResponse = await fetch(wasmURL);
        if (!wasmResponse.ok) {
          throw new Error(`WASM file not found: ${wasmResponse.status}`);
        }
        console.log('WASM file found');
      } catch (fetchError) {
        console.error('File fetch error:', fetchError);
        throw new Error(`FFmpeg 파일을 찾을 수 없습니다: ${fetchError.message}`);
      }
      
      await ffmpeg.load({
        coreURL: await toBlobURL(coreURL, 'text/javascript'),
        wasmURL: await toBlobURL(wasmURL, 'application/wasm'),
      });
      
      ffmpegLoaded = true;
      showStatus('FFmpeg 준비 완료!', 'success');
      setTimeout(() => hideStatus(), 2000);
    } catch (error) {
      ffmpegLoaded = false;
      showStatus(`FFmpeg 로드 실패: ${error.message}`, 'error');
      console.error('FFmpeg load error:', error);
      console.error('Error stack:', error.stack);
    }
  }

  // 파일 선택 처리
  uploadArea.addEventListener('click', (e) => {
    // fileInput을 직접 클릭한 경우가 아니면 파일 선택 다이얼로그 열기
    if (e.target !== fileInput) {
      console.log('Upload area clicked, triggering file input');
      fileInput.click();
    }
  });
  
  // 드래그앤드롭 이벤트
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  });
  
  // 파일 입력 변경 이벤트
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });
  
  // 전체 문서에 드롭 방지 (기본 동작 차단)
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  function handleFileSelect(file) {
    console.log('File selected:', file.name, file.type, file.size);
    if (!file.type.startsWith('video/')) {
      showStatus('동영상 파일만 선택할 수 있습니다.', 'error');
      return;
    }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.add('show');
    compressBtn.disabled = false;
    downloadBtn.disabled = true;
    downloadBtn.style.display = 'none';
    compressedBlob = null;
    showStatus('파일이 선택되었습니다. 압축을 시작할 수 있습니다.', 'success');
    setTimeout(() => hideStatus(), 3000);
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // 품질 슬라이더 업데이트
  qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value;
  });

  // 압축 시작
  compressBtn.addEventListener('click', async () => {
    if (!selectedFile) {
      showStatus('파일을 먼저 선택해주세요.', 'error');
      return;
    }

    if (!ffmpegLoaded) {
      showStatus('FFmpeg가 아직 로드되지 않았습니다. 잠시만 기다려주세요...', 'error');
      // FFmpeg가 로드될 때까지 대기
      const checkInterval = setInterval(() => {
        if (ffmpegLoaded) {
          clearInterval(checkInterval);
          compressBtn.click(); // 다시 시도
        }
      }, 500);
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!ffmpegLoaded) {
          showStatus('FFmpeg 로드에 실패했습니다. 페이지를 새로고침해주세요.', 'error');
        }
      }, 30000);
      return;
    }

    compressBtn.disabled = true;
    progressContainer.classList.add('show');
    updateProgress(0, '파일 읽는 중...');
    hideStatus();

    try {
      const crf = qualitySlider.value;
      const inputFileName = 'input.' + selectedFile.name.split('.').pop();
      const outputFileName = 'output.mp4';

      // 파일을 FFmpeg에 쓰기
      updateProgress(10, 'FFmpeg에 파일 로드 중...');
      await ffmpeg.writeFile(inputFileName, await fetchFile(selectedFile));

      // 압축 실행
      updateProgress(20, '동영상 압축 중...');
      await ffmpeg.exec([
        '-i', inputFileName,
        '-c:v', 'libx264',
        '-crf', crf,
        '-preset', 'medium',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        outputFileName
      ]);

      // 결과 파일 읽기
      updateProgress(90, '압축된 파일 생성 중...');
      const data = await ffmpeg.readFile(outputFileName);
      compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });

      // 파일 정리
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      updateProgress(100, '완료!');
      showStatus(`압축 완료! 원본: ${formatFileSize(selectedFile.size)}, 압축: ${formatFileSize(compressedBlob.size)} (${Math.round((1 - compressedBlob.size / selectedFile.size) * 100)}% 감소)`, 'success');
      
      downloadBtn.disabled = false;
      downloadBtn.style.display = 'block';
      compressBtn.disabled = false;
    } catch (error) {
      showStatus(`압축 실패: ${error.message}`, 'error');
      console.error(error);
      compressBtn.disabled = false;
      progressContainer.classList.remove('show');
    }
  });

  // 다운로드
  downloadBtn.addEventListener('click', () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_' + selectedFile.name.replace(/\.[^/.]+$/, '') + '.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  function updateProgress(percent, text) {
    progressFill.style.width = percent + '%';
    progressFill.textContent = percent + '%';
    progressText.textContent = text;
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status show ' + type;
  }

  function hideStatus() {
    status.classList.remove('show');
  }

  // 페이지 로드 시 FFmpeg 초기화
  loadFFmpeg();
}

