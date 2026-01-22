import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

// 서버를 백그라운드로 시작
const server = spawn('node', ['server.js'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[서버] ${output}`);
  if (output.includes('실행 중입니다')) {
    serverReady = true;
  }
});

server.stderr.on('data', (data) => {
  console.error(`[서버 에러] ${data.toString()}`);
});

// 서버가 준비될 때까지 대기
async function waitForServer() {
  for (let i = 0; i < 20; i++) {
    if (serverReady) {
      return true;
    }
    await setTimeout(500);
  }
  throw new Error('서버가 시작되지 않았습니다');
}

// 클라이언트 실행
async function runClient() {
  return new Promise((resolve, reject) => {
    const client = spawn('node', ['client.js'], {
      stdio: 'inherit'
    });
    
    client.on('close', (code) => {
      resolve(code);
    });
    
    client.on('error', (error) => {
      reject(error);
    });
  });
}

// 메인 테스트 함수
async function main() {
  try {
    console.log('서버 시작 대기 중...');
    await waitForServer();
    
    console.log('\n클라이언트 테스트 실행 중...\n');
    const exitCode = await runClient();
    
    if (exitCode === 0) {
      console.log('\n✅ QA 테스트 성공!');
    } else {
      console.log('\n❌ QA 테스트 실패!');
    }
    
    // 서버 종료
    server.kill();
    process.exit(exitCode);
  } catch (error) {
    console.error('테스트 실행 중 오류:', error);
    server.kill();
    process.exit(1);
  }
}

// 프로세스 종료 시 서버도 종료
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});

main();
