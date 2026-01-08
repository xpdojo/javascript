let ws = null;
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const clearBtn = document.getElementById('clearBtn');
const wsUrlInput = document.getElementById('wsUrl');
const statusDiv = document.getElementById('status');

// 콘솔에 타임스탬프와 함께 로그 출력
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('ko-KR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
    const prefix = {
        'info': 'ℹ️',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'event': '🔔',
        'handshake': '🤝'
    }[type] || '📝';
    
    console.log(`[${timestamp}] ${prefix} ${message}`);
}

// WebSocket 상태를 문자열로 변환
function getStateString(state) {
    const states = {
        0: 'CONNECTING (연결 중)',
        1: 'OPEN (연결됨)',
        2: 'CLOSING (종료 중)',
        3: 'CLOSED (종료됨)'
    };
    return states[state] || `UNKNOWN (${state})`;
}

// 상태 업데이트
function updateStatus(state, message = '') {
    statusDiv.className = 'status';
    if (state === WebSocket.CONNECTING) {
        statusDiv.classList.add('connecting');
        statusDiv.textContent = `상태: ${getStateString(state)} ${message}`;
    } else if (state === WebSocket.OPEN) {
        statusDiv.classList.add('connected');
        statusDiv.textContent = `상태: ${getStateString(state)} ${message}`;
    } else {
        statusDiv.classList.add('disconnected');
        statusDiv.textContent = `상태: ${getStateString(state)} ${message}`;
    }
}

// WebSocket 연결
function connect() {
    const url = wsUrlInput.value.trim();
    
    if (!url) {
        log('URL을 입력해주세요.', 'error');
        return;
    }

    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'handshake');
    log('WebSocket 연결 시작', 'handshake');
    log(`서버 URL: ${url}`, 'handshake');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'handshake');
    
    log('1️⃣ WebSocket 객체 생성 중...', 'handshake');
    log(`   new WebSocket("${url}")`, 'handshake');
    
    try {
        // 새로운 WebSocket 객체 생성
        ws = new WebSocket(url);
        updateStatus(WebSocket.CONNECTING);
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;

        // 연결 시작 시점
        log('2️⃣ WebSocket 객체 생성 완료', 'handshake');
        log(`   현재 상태: ${getStateString(ws.readyState)}`, 'handshake');
        log('   → 브라우저가 HTTP Upgrade 요청을 전송합니다', 'handshake');
        log('   → Network 탭에서 "101 Switching Protocols" 응답을 확인하세요', 'handshake');

        // WebSocket 이벤트 리스너
        
        // open 이벤트: Handshake 완료, 연결 성공
        ws.onopen = function(event) {
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
            log('3️⃣ ✅ WebSocket Handshake 완료!', 'success');
            log(`   현재 상태: ${getStateString(ws.readyState)}`, 'success');
            log('   → HTTP 101 Switching Protocols 응답을 받았습니다', 'success');
            log('   → 이제 양방향 통신이 가능합니다', 'success');
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
            
            log('📤 onopen 이벤트 발생', 'event');
            log(`   Event type: ${event.type}`, 'event');
            log(`   Timestamp: ${new Date(event.timeStamp).toISOString()}`, 'event');
            
            updateStatus(WebSocket.OPEN, '연결 성공!');
        };

        // message 이벤트
        ws.onmessage = function(event) {
            log('📨 메시지 수신', 'event');
            log(`   데이터 타입: ${typeof event.data}`, 'event');
            log(`   데이터: ${event.data}`, 'event');
            log(`   데이터 크기: ${event.data.length || event.data.byteLength || 'N/A'} bytes`, 'event');
        };

        // error 이벤트: Handshake 실패 또는 연결 오류
        ws.onerror = function(error) {
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'error');
            log('❌ WebSocket 오류 발생', 'error');
            log('   → Handshake 실패 또는 연결 오류가 발생했습니다', 'error');
            log(`   Error 객체:`, 'error');
            console.error('   ', error);
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'error');
            
            log('📤 onerror 이벤트 발생', 'event');
            updateStatus(ws.readyState);
        };

        // close 이벤트: 연결 종료
        ws.onclose = function(event) {
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'warning');
            log('🔌 WebSocket 연결 종료', 'warning');
            log(`   현재 상태: ${getStateString(ws.readyState)}`, 'warning');
            log(`   Close code: ${event.code}`, 'warning');
            log(`   Close reason: ${event.reason || '(없음)'}`, 'warning');
            log(`   Was clean: ${event.wasClean}`, 'warning');
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'warning');
            
            log('📤 onclose 이벤트 발생', 'event');
            log(`   Event type: ${event.type}`, 'event');
            
            updateStatus(WebSocket.CLOSED);
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
            ws = null;
        };

        // readyState 변화 모니터링 (폴링)
        let lastState = ws.readyState;
        const stateMonitor = setInterval(() => {
            if (ws && ws.readyState !== lastState) {
                log(`🔄 상태 변화: ${getStateString(lastState)} → ${getStateString(ws.readyState)}`, 'info');
                lastState = ws.readyState;
                updateStatus(ws.readyState);
            }
            if (!ws || ws.readyState === WebSocket.CLOSED) {
                clearInterval(stateMonitor);
            }
        }, 100);

    } catch (error) {
        log('❌ WebSocket 생성 실패', 'error');
        log(`   오류: ${error.message}`, 'error');
        console.error(error);
        updateStatus(WebSocket.CLOSED);
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
    }
}

// WebSocket 연결 해제
function disconnect() {
    if (ws) {
        log('🔌 연결 해제 요청...', 'info');
        ws.close(1000, '사용자에 의한 종료');
    }
}

// 콘솔 지우기
function clearConsole() {
    console.clear();
    log('콘솔이 지워졌습니다.', 'info');
}

// 이벤트 리스너
connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);
clearBtn.addEventListener('click', clearConsole);

wsUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        connect();
    }
});

// 초기 로그
log('WebSocket Handshake 모니터링 앱이 준비되었습니다.', 'success');
log('브라우저 개발자 도구(F12)의 Console 탭을 확인하세요.', 'info');
log('Network 탭에서 WebSocket 연결을 선택하면 Handshake 헤더를 볼 수 있습니다.', 'info');
