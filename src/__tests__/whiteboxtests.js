const { createUser} = require("../controllers/userController"); 
const { checkPermission } = require("../rbac");
const UserDatabaseStub = require('../database/userDatabaseStub');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');
const request = require('supertest');
const app = require("../app");

//cobertura de condições multiplas
describe('CreateUser - Cobertura de condições multiplas', () => {
    let req, res, dbStub;

    beforeEach(() => {
        userDb = new UserDatabaseStub();

        req = { body: {} };
        res = {
            json: jest.fn()
        };
    });

    test('deve retornar erro se o campo name estiver ausente', () => {
        req.body = { email: 'test@example.com', role: 'user', password: 'password123' };
        createUser(req, res, dbStub);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Todos os campos são necessários." });
    });

    test('deve retornar erro se o campo email estiver ausente', () => {
        req.body = { name: 'Test User', role: 'user', password: 'password123' };
        createUser(req, res, dbStub);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Todos os campos são necessários." });
    });

    test('deve retornar erro se o campo role estiver ausente', () => {
        req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
        createUser(req, res, dbStub);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Todos os campos são necessários." });
    });

    test('deve retornar erro se o campo password estiver ausente', () => {
        req.body = { name: 'Test User', email: 'test@example.com', role: 'user' };
        createUser(req, res, dbStub);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Todos os campos são necessários." });
    });
});

//cobertura de decisões
describe('Check Permission - Cobertura de decisões', () => {

  beforeEach(() => {
  });

  test('Role não existe', () => {
    result = checkPermission("nao_existo", null, null);
    expect(result).toBe(false);
  });

  test('Compara método com lista', () => {
    result = checkPermission("admin", "DELETE", null);
    expect(result).toBe(false);
  });

  test('Verifica se tem parametro adicional (/:id)', () => {
    result = checkPermission("admin", "GET", "/api/order/1");
    expect(result).toBe(true);
  });

  test('Verifica se route existe', () => {
    result = checkPermission("admin", "GET", "nao_existo");
    expect(result).toBe(false);
  });

  test('Verifica se não tem parametro adicional', () => {
    result = checkPermission("admin", "POST", "/api/user");
    expect(result).toBe(true);
  });
});

//cobertura de condições
describe('Check Permission - Cobertura de condições', () => {

  beforeEach(() => {
  });

  test('Verifica se tem parametro adicional (/:id)', () => {
    result = checkPermission("admin", "GET", "/api/order/1");
    expect(result).toBe(true);
  });

  test('Verifica se não tem parametro adicional', () => {
    result = checkPermission("admin", "POST", "/api/user");
    expect(result).toBe(true);
  });

});

//cobertura de decisões/condições
describe('UserDatabaseStub - Cobertura de decisão/condições', () => {
  let userDb;

  beforeEach(() => {
    userDb = new UserDatabaseStub();
  });

  test('Login with valid user and correct password', () => {
    const result = userDb.login('lucasmsebastiao@gmail.com', 'senha');

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('lucasmsebastiao@gmail.com');
    
    const decoded = jwt.verify(result.token, JWT_SECRET);
    expect(decoded.email).toBe('lucasmsebastiao@gmail.com');
  });

  test('Login with valid user and incorrect password', () => {
    const result = userDb.login('lucasmsebastiao@gmail.com', 'wrongpassword');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Algum dado esta errado.');
  });

  test('Login with invalid user', () => {
    const result = userDb.login('invaliduser@example.com', 'senha');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Algum dado esta errado.');
  });
});

//cobertura de instruções
describe('POST /api/login - Cobertura de instruções', () => {
  it('should return 401 if credentials are invalid', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'user1', password: 'wrongpassword' });

    expect(response.body.message).toBe('Algum dado esta errado.');
  });

  it('should return a token if credentials are valid', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'lucasmsebastiao@gmail.com', password: 'senha' });

    expect(response.body.token).toBeDefined();

    const decoded = jwt.verify(response.body.token, JWT_SECRET);
    expect(decoded.email).toBe('lucasmsebastiao@gmail.com');
  });
});