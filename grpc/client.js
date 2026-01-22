import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// proto 파일 로드
const PROTO_PATH = path.join(__dirname, 'calculator.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const calculatorProto = grpc.loadPackageDefinition(packageDefinition).calculator;

// 클라이언트 생성
const client = new calculatorProto.Calculator(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 테스트 함수들
function testAdd() {
  return new Promise((resolve, reject) => {
    client.Add({ a: 10, b: 5 }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Add 결과: 10 + 5 = ${response.result}`);
        resolve(response.result);
      }
    });
  });
}

function testSubtract() {
  return new Promise((resolve, reject) => {
    client.Subtract({ a: 10, b: 5 }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Subtract 결과: 10 - 5 = ${response.result}`);
        resolve(response.result);
      }
    });
  });
}

function testMultiply() {
  return new Promise((resolve, reject) => {
    client.Multiply({ a: 10, b: 5 }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Multiply 결과: 10 * 5 = ${response.result}`);
        resolve(response.result);
      }
    });
  });
}

function testDivide() {
  return new Promise((resolve, reject) => {
    client.Divide({ a: 10, b: 5 }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Divide 결과: 10 / 5 = ${response.result}`);
        resolve(response.result);
      }
    });
  });
}

function testDivideByZero() {
  return new Promise((resolve, reject) => {
    client.Divide({ a: 10, b: 0 }, (error, response) => {
      if (error) {
        console.log(`Divide by zero 에러 (예상됨): ${error.message}`);
        resolve('error'); // 에러가 예상되므로 성공으로 처리
      } else {
        reject(new Error('0으로 나누기 에러가 발생해야 하는데 발생하지 않았습니다'));
      }
    });
  });
}

// 모든 테스트 실행
async function runTests() {
  console.log('=== gRPC 클라이언트 테스트 시작 ===\n');

  try {
    await testAdd();
    await testSubtract();
    await testMultiply();
    await testDivide();
    await testDivideByZero();

    console.log('\n=== 모든 테스트 완료 ===');
    process.exit(0);
  } catch (error) {
    console.error('테스트 실패:', error);
    process.exit(1);
  }
}

runTests();
