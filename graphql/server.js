import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// GraphQL 스키마 정의
const schema = buildSchema(`
  type Query {
    hello: String
    user(id: Int!): User
    users: [User]
  }

  type User {
    id: Int
    name: String
    email: String
  }
`);

// 사용자 데이터
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

// Resolver 함수
const root = {
  hello: () => 'Hello, GraphQL!',
  user: ({ id }) => users.find(user => user.id === id),
  users: () => users,
};

// Express 앱 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.json());

// 정적 파일 제공 (public 폴더)
app.use(express.static(join(__dirname, 'public')));

// GraphQL API Endpoint
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

// GraphiQL IDE (개발자용)
app.get('/graphiql', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>GraphiQL IDE</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphiql@3/graphiql.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/graphiql@3/graphiql.min.js"></script>
      </head>
      <body style="margin: 0;">
        <div id="graphiql" style="height: 100vh;"></div>
        <script>
          const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
          ReactDOM.render(
            React.createElement(GraphiQL, { fetcher }),
            document.getElementById('graphiql')
          );
        </script>
      </body>
    </html>
  `);
});

// 서버 시작
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 시작되었습니다!`);
  console.log(`📱 사용자 화면: http://localhost:${PORT}/`);
  console.log(`🔧 GraphiQL IDE: http://localhost:${PORT}/graphiql`);
  console.log(`🌐 GraphQL 엔드포인트: http://localhost:${PORT}/graphql`);
});
