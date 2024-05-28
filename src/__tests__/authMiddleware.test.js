const { verifyToken, hasPermission } = require("../auth");
const authMiddleware = require("../authMiddleware");
const jwt = require("jsonwebtoken");
const { checkPermission } = require("../rbac");
const { JWT_SECRET } = require("../constants");

jest.mock("../auth");
jest.mock("jsonwebtoken");
jest.mock("../rbac");

const UserDatabaseStub = require("../database/userDatabaseStub");
const OrderDatabaseStub = require("../database/orderDatabaseStub");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
      method: "GET",
      originalUrl: "/test"
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Testes para a função verifyToken
  describe("verifyToken", () => {
    beforeEach(() => {
      // Limpar mocks e configurar o mock para jwt.verify
      jest.clearAllMocks();
      jwt.verify.mockReturnValue({ id: 1, name: "Test User" });
    });

    it("should decode a valid JWT token", () => {
      const user = { id: 1, email: "test@example.com", role: "admin" };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
      verifyToken.mockReturnValue(user);
      const result = verifyToken(token);
      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(jwt.verify).toHaveBeenCalledWith(token, JWT_SECRET);
      expect(result).toEqual(user);
    });

    it("should throw an error for an invalid JWT token", () => {
      const token = "invalid_token";
      verifyToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => {
        verifyToken(token);
      }).toThrow("Invalid token");
    });

    it("should throw an error for null or empty JWT token", () => {
      const token = null;

      expect(() => {
        verifyToken(token);
      }).toThrow(jwt.JsonWebTokenError);
    });
  });

  // Testes para a função hasPermission
  describe("hasPermission", () => {
    it("should return true if user has permission", () => {
      const user = { id: 2, role: "user" };
      const method = "GET";
      const path = "/user/resource";
      checkPermission.mockReturnValue(true);

      const result = hasPermission(user, method, path);
      expect(result).toBe(true);
      expect(checkPermission).toHaveBeenCalledWith(user.role, method, path);
    });

    it("should return false if user does not have permission", () => {
      const user = { id: 1, role: "user" };
      const method = "POST";
      const path = "/api/resource";
      checkPermission.mockReturnValue(false);

      const result = hasPermission(user, method, path);
      expect(result).toBe(false);
      expect(checkPermission).toHaveBeenCalledWith(user.role, method, path);
    });
  });

  // Testes para authMiddleware com integração dos mocks
  describe("authMiddleware integration", () => {
    it("should call next with 401 error if Authorization header is missing", () => {
      authMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith({ status: 401, message: "Token does't exist" });
    });

    it("should call next with 401 error if the token is null", () => {
      req.headers.authorization = "Bearer ";
      authMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith({ status: 401, message: "Token does't exist" });
    });

    it("should call next with 401 error if verifyToken throws an exception", () => {
      req.headers.authorization = "Bearer invalid_token";
      verifyToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      authMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith({ status: 401, message: "Invalid or expired token" });
    });

    it("should call next without errors if the token is valid and the user has permission", () => {
      req.headers.authorization = "Bearer valid_token";
      const decodedUser = { id: 1, name: "Test User" };
      verifyToken.mockReturnValue(decodedUser);
      hasPermission.mockReturnValue(true);

      authMiddleware(req, res, next);
      expect(req.user).toBe(decodedUser);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with 403 error if the token is valid but the user does not have permission", () => {
      req.headers.authorization = "Bearer valid_token";
      const decodedUser = { id: 1, name: "Test User" };
      verifyToken.mockReturnValue(decodedUser);
      hasPermission.mockReturnValue(false);

      authMiddleware(req, res, next);
      expect(req.user).toBe(decodedUser);
      expect(next).toHaveBeenCalledWith({ status: 403, message: "Access denied" });
    });
  });
});

describe("UserDatabaseStub", () => {
  let userDb;

  beforeEach(() => {
    userDb = new UserDatabaseStub();
  });

  afterEach(() => {
    userDb = null;
  });

  it("should return a user by id", () => {
    const id = 1;
    const user = userDb.get(id);
    expect(user).toEqual({
      id: 1,
      name: "Lucas Sebastião",
      email: "lucasmsebastiao@gmail.com",
      role: "admin",
      password: "senha"
    });
  });

  it("should update a user", () => {
    const id = 1;
    const updatedUser = { name: "Lucas Updated" };
    const result = userDb.update(id, updatedUser);
    expect(result.name).toBe("Lucas Updated");
  });

  it("should create a new user", () => {
    const result = userDb.create("Test User", "test@example.com", "user", "password");
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("id");
    expect(result.data.name).toBe("Test User");
  });

  it("should delete a user", () => {
    const id = 1;
    userDb.delete(id);
    const user = userDb.get(id);
    expect(user).toBe(null);
  });

  it("should log in a user successfully", () => {
    const result = userDb.login("lucasmsebastiao@gmail.com", "senha");
    console.log(result); // Adicione isso para verificar a saída do método login
    expect(result.user.name).toBe("Lucas Sebastião");
    expect(result.token).toBeTruthy();
  });

  it("should fail to log in with incorrect credentials", () => {
    const result = userDb.login("lucasmsebastiao@gmail.com", "wrongpassword");
    expect(result.success).toBe(false);
    expect(result.message).toBe("Algum dado esta errado.");
  });

  it("should fail to create a user with an existing email", () => {
    const result = userDb.create("Test User", "lucasmsebastiao@gmail.com", "user", "password");
    expect(result.success).toBe(false);
    expect(result.message).toBe("Email já está em uso.");
  });
});

describe("OrderDatabaseStub", () => {
  let orderDb;

  beforeEach(() => {
    orderDb = new OrderDatabaseStub();
  });

  afterEach(() => {
    orderDb = null;
  });

  it("should return an existing order by id", () => {
    const id = 1;
    const order = orderDb.get(id);
    expect(order).toEqual({
      id: 1,
      items: ["Item 1", "Item 2"],
      total: 50.0,
      user: 1
    });
  });

  it("should return an object with success: false and an error message for non-existent order ID", () => {
    const id = 10; // ID que não existe nos dados simulados
    const result = orderDb.get(id);
    expect(result).toEqual({ success: false, error: "Utilizador não existe." });
  });

  it("should create a new order", () => {
    const newOrder = {
      items: ["New Item 1", "New Item 2"],
      total: 200.0,
      user: 4
    };
    const result = orderDb.create(newOrder);
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("id");
    expect(result.data.items).toEqual(newOrder.items);
    expect(result.data.total).toBe(newOrder.total);
    expect(result.data.user).toBe(newOrder.user);
  });
});
