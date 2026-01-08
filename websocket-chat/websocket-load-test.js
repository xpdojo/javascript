import ws from 'k6/ws';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 커스텀 메트릭
const messageRate = new Rate('messages_sent');
const connectionRate = new Rate('connections_successful');
const messageLatency = new Trend('message_latency');

// 테스트 설정
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // 10초 동안 10명의 사용자로 증가
    { duration: '30s', target: 50 },    // 30초 동안 50명의 사용자로 증가
    { duration: '30s', target: 100 },   // 30초 동안 100명의 사용자로 증가
    { duration: '30s', target: 50 },    // 30초 동안 50명으로 감소
    { duration: '10s', target: 0 },      // 10초 동안 0명으로 감소
  ],
  thresholds: {
    'connections_successful': ['rate>0.95'], // 95% 이상 연결 성공
    'messages_sent': ['rate>0.9'],            // 90% 이상 메시지 전송 성공
    'ws_connecting': ['p(95)<1000'],         // 95% 연결 시간이 1초 미만
    'ws_session_duration': ['p(95)<60000'],  // 95% 세션 시간이 60초 미만
  },
};

export default function () {
  // Socket.IO는 Engine.IO 프로토콜을 사용
  // EIO=4는 Engine.IO 버전 4, transport=websocket은 WebSocket 전송 사용
  const url = 'ws://localhost:3000/socket.io/?EIO=4&transport=websocket';
  
  const params = {
    tags: { name: 'Socket.IO Chat' },
  };

  const response = ws.connect(url, params, function (socket) {
    let connected = false;
    let sessionId = null;

    // Socket.IO 연결 확인
    socket.on('open', () => {
      console.log(`VU${__VU}: WebSocket connection opened`);
    });

    // Socket.IO 메시지 처리
    socket.on('message', (data) => {
      const message = String(data);
      
      // Engine.IO 프로토콜 메시지 파싱
      if (message.startsWith('0')) {
        // 연결 확인 메시지 (0{"sid":"...","upgrades":[],"pingInterval":25000,"pingTimeout":5000})
        try {
          const handshake = JSON.parse(message.substring(1));
          sessionId = handshake.sid;
          connected = true;
          connectionRate.add(1);
          console.log(`VU${__VU}: Socket.IO connected, SID: ${sessionId}`);
          
          // 네임스페이스 연결 (40은 네임스페이스 연결)
          socket.send('40');
        } catch (e) {
          console.error(`VU${__VU}: Failed to parse handshake:`, e);
        }
      } else if (message.startsWith('40')) {
        // 네임스페이스 연결 확인
        console.log(`VU${__VU}: Namespace connected`);
      } else if (message.startsWith('42')) {
        // 이벤트 메시지 (42["event_name", data])
        try {
          const eventData = JSON.parse(message.substring(2));
          const [eventName, eventPayload] = eventData;
          
          if (eventName === 'chat_history') {
            console.log(`VU${__VU}: Received chat history`);
          } else if (eventName === 'send_message') {
            const startTime = Date.now();
            messageLatency.add(Date.now() - startTime);
            console.log(`VU${__VU}: Received broadcast message:`, eventPayload);
          }
        } catch (e) {
          console.error(`VU${__VU}: Failed to parse event:`, e);
        }
      } else if (message.startsWith('3')) {
        // Pong 응답
        console.log(`VU${__VU}: Received pong`);
      }
    });

    // 연결 후 메시지 전송
    socket.setTimeout(() => {
      if (connected) {
        // Socket.IO 이벤트 전송: 42["send_message","메시지 내용"]
        const testMessage = `42["send_message","VU${__VU} 메시지 ${Date.now()}"]`;
        const startTime = Date.now();
        socket.send(testMessage);
        messageRate.add(1);
        messageLatency.add(Date.now() - startTime);
        console.log(`VU${__VU}: Sent message`);
      }
    }, 2000);

    // 주기적으로 메시지 전송 (5초마다)
    const messageInterval = setInterval(() => {
      if (connected) {
        const message = `42["send_message","VU${__VU} 메시지 ${Date.now()}"]`;
        const startTime = Date.now();
        socket.send(message);
        messageRate.add(1);
        messageLatency.add(Date.now() - startTime);
      }
    }, 5000);

    // Ping 전송 (25초마다 - Socket.IO 기본 pingInterval)
    const pingInterval = setInterval(() => {
      if (connected) {
        socket.send('2'); // Engine.IO ping
      }
    }, 25000);

    // 연결 종료 전 정리
    socket.setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(pingInterval);
      socket.close();
      console.log(`VU${__VU}: Connection closed`);
    }, 60000); // 60초 후 연결 종료
  });

  check(response, {
    'WebSocket 연결 성공': (r) => r && r.status === 101,
  });
}
