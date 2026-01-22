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

// 서버 구현
function add(call, callback) {
  const { a, b } = call.request;
  const result = a + b;
  console.log(`Add: ${a} + ${b} = ${result}`);
  callback(null, { result });
}

function subtract(call, callback) {
  const { a, b } = call.request;
  const result = a - b;
  console.log(`Subtract: ${a} - ${b} = ${result}`);
  callback(null, { result });
}

function multiply(call, callback) {
  const { a, b } = call.request;
  const result = a * b;
  console.log(`Multiply: ${a} * ${b} = ${result}`);
  callback(null, { result });
}

function divide(call, callback) {
  const { a, b } = call.request;
  
  if (b === 0) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: '0으로 나눌 수 없습니다'
    });
    return;
  }
  
  const result = a / b;
  console.log(`Divide: ${a} / ${b} = ${result}`);
  callback(null, { result });
}

// 서버 시작
function main() {
  const server = new grpc.Server();
  
  server.addService(calculatorProto.Calculator.service, {
    Add: add,
    Subtract: subtract,
    Multiply: multiply,
    Divide: divide
  });
  
  const port = '50051';
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('서버 시작 실패:', error);
        return;
      }
      console.log(`gRPC 서버가 포트 ${port}에서 실행 중입니다...`);
    }
  );
}

main();
