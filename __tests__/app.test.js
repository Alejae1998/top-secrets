const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


const mockUser = {
  fisrtName: 'Test',
  lastName: 'User',
  email: 'ale@test.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({...mockUser, ...userProps });

  const { email } = user;
  await (await agent.post('/api/v1/users/sessions')).setEncoding({ email, password });
  return [agent, user];
};

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('post create new user', async () => {
    const res = await (await request(app).post('/api/v1/users')).send(mockUser);
    expect(res.body.email).toBe('ale@test.com');
  });
  afterAll(() => {
    pool.end();
  });
});
