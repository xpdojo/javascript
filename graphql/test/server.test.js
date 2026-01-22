import { describe, it, expect } from '@jest/globals';
import { buildSchema, graphql } from 'graphql';

// 서버의 스키마와 resolver를 import
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

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

const root = {
  hello: () => 'Hello, GraphQL!',
  user: ({ id }) => users.find(user => user.id === id),
  users: () => users,
};

describe('GraphQL API 테스트', () => {
  describe('hello 쿼리', () => {
    it('hello 쿼리가 정상적으로 작동해야 함', async () => {
      const query = '{ hello }';
      const result = await graphql({ schema, source: query, rootValue: root });

      expect(result.errors).toBeUndefined();
      expect(result.data.hello).toBe('Hello, GraphQL!');
    });
  });

  describe('user 쿼리', () => {
    it('특정 ID의 사용자를 조회할 수 있어야 함', async () => {
      const query = `
        {
          user(id: 1) {
            id
            name
            email
          }
        }
      `;
      const result = await graphql({ schema, source: query, rootValue: root });

      expect(result.errors).toBeUndefined();
      expect(result.data.user).toEqual({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
      });
    });

    it('존재하지 않는 사용자 ID는 null을 반환해야 함', async () => {
      const query = `
        {
          user(id: 999) {
            id
            name
          }
        }
      `;
      const result = await graphql({ schema, source: query, rootValue: root });

      expect(result.errors).toBeUndefined();
      expect(result.data.user).toBeNull();
    });
  });

  describe('users 쿼리', () => {
    it('모든 사용자 목록을 반환해야 함', async () => {
      const query = `
        {
          users {
            id
            name
            email
          }
        }
      `;
      const result = await graphql({ schema, source: query, rootValue: root });

      expect(result.errors).toBeUndefined();
      expect(result.data.users).toHaveLength(3);
      expect(result.data.users[0]).toHaveProperty('id');
      expect(result.data.users[0]).toHaveProperty('name');
      expect(result.data.users[0]).toHaveProperty('email');
    });
  });
});
