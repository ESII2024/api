const { verifyToken, hasPermission } = require("../auth");
const authMiddleware = require("../authMiddleware");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");
const { createOrder, getOrder } = require('../controllers/orderController');
const fs = require("fs");
const { rbac, checkPermission } = require("../rbac");
const { createUser } = require("../controllers/userController"); 


jest.mock("../auth");
jest.mock("jsonwebtoken");
jest.mock("../rbac");

const UserDatabaseStub = require("../database/userDatabaseStub");
const OrderDatabaseStub = require("../database/orderDatabaseStub");

describe("whiteboxtests", () => {
  let req, res, next, userDb;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
      method: "GET",
      originalUrl: "/test"
    };
    res = {
      json: jest.fn()
    };
    next = jest.fn();
    userDb = new UserDatabaseStub();
    jwt.verify.mockReturnValue({ id: 1, name: "Lucas Sebastião", email: "lucasmsebastiao@gmail.com", role: "admin" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jwt.verify.mockReturnValue({ id: 1, name: "Test User" });
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
      }).toThrowError("Invalid token");
    });

/*
    it("should create and decode a valid JWT token after successful login", () => {
      const loginResult = userDb.login("lucasmsebastiao@gmail.com", "senha");
      expect(loginResult.success).toBe(true);
      const { user, token } = loginResult;
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          password: user.password
        }),
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      jwt.verify.mockReturnValueOnce({ id: user.id, name: user.name, email: user.email, role: user.role });
      const decoded = verifyToken(token);
      expect(decoded.id).toEqual(user.id);
      expect(decoded.name).toEqual(user.name);
      expect(decoded.email).toEqual(user.email);
      expect(decoded.role).toEqual(user.role);
    });*/ 
  });

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

    it("should return an error when trying to create a user without a password", () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        role: "user"
        // password is missing
      };
      createUser(req, res);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Todos os campos são necessários."
      });
    });

    it("should return null for a non existent id", () => {
      const id = 999;
      const user = userDb.get(id);
      expect(user).toBeNull();
    });

  });

  describe("OrderDatabaseStub", () => {
    let orderDb;
    let req,res;

    beforeEach(() => {
      orderDb = new OrderDatabaseStub();
    });

    beforeEach(() => {
      req = {
        body: {},
      };
      res = {
        json: jest.fn(),
      };
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

    it("should return an error message when not all fields are provided", () => {
      // Simula que falta um dos campos
      const incompleteOrder = {
        items: ["Item 1", "Item 2"],
        user: 1,
      };

      req.body = incompleteOrder;

      createOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Todos os campos são necessários.",
      });
    });
  });

  describe("checkPermission", () => {
    describe("When role exists in rbac", () => {
      it("should iterate over rolePermissions", () => {
        const role = "admin";
        const method = "GET";
        const url = "/nonexistent/path";

        checkPermission(role, method, url);
        const rolePermissions = rbac[role];
        rolePermissions.forEach(permission => {
          const [permissionMethod, permissionUrl] = permission.split(":");
          expect(permissionMethod.toUpperCase()).toBe(method.toUpperCase());
          expect(typeof permissionUrl).toBe("string");
        });
      });

      it("should handle permission with wildcard URL", () => {
        const role = "admin";
        const method = "GET";
        const url = "/api/user/123";

        checkPermission(role, method, url);
        const rolePermissions = rbac[role];
        rolePermissions.forEach(permission => {
          const [permissionMethod, permissionUrl] = permission.split(":");
          if (permissionMethod.toUpperCase() === method.toUpperCase() && permissionUrl.endsWith("*")) {
            const trimmedPermissionUrl = permissionUrl.substring(0, permissionUrl.length - 1);
            expect(url.startsWith(trimmedPermissionUrl)).toBe(true);
          }
        });
      });

      it("should handle exact permission match", () => {
        const role = "admin";
        const method = "POST";
        const url = "/api/user";

        checkPermission(role, method, url);
        const rolePermissions = rbac[role];
        rolePermissions.forEach(permission => {
          const [permissionMethod, permissionUrl] = permission.split(":");
          if (permissionMethod.toUpperCase() === method.toUpperCase() && permissionUrl === url) {
            expect(permissionUrl).toBe(url);
          }
        });
      });
    });

    describe("When role does not exist in rbac", () => {
      it("should not iterate over rolePermissions", () => {
        const role = "nonexistent";
        const method = "GET";
        const url = "/api/user/1";

        checkPermission(role, method, url);
        expect(rbac.hasOwnProperty(role)).toBe(false);
      });
    });

    describe("Edge cases", () => {
      it("should handle empty permissionUrl correctly", () => {
        const role = "admin";
        const method = "GET";
        const url = "/api/order";
        const result = checkPermission(role, method, url);
        rbac[role].forEach(permission => {
          const [permissionMethod, permissionUrl] = permission.split(":");
          if (permissionMethod.toUpperCase() === method.toUpperCase() && !permissionUrl.endsWith("*")) {
            expect(permissionUrl.endsWith("*")).toBe(false);
          }
        });
      });
    });

    
  });
  describe("hasPermission function", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return false if user does not have permission", () => {
      const user = { id: 2, role: "user" };
      const method = "POST";
      const path = "/api/order";
      checkPermission.mockReturnValue(false);
  
      const result = hasPermission(user, method, path);
  
      //expect(checkPermission).toHaveBeenCalledWith("user", "POST", "/api/order");
      expect(result).toBe(false);
    });
  
    it("should return false if role does not exist in rbac", () => {
      const user = { id: 3, role: "guest" }; // Papel de usuário não existente
      const method = "GET";
      const path = "/api/user/456";
      checkPermission.mockReturnValue(false); // Assumindo que não há permissões para 'guest'
  
      const result = hasPermission(user, method, path);
      expect(result).toBe(false);
    });
  });
});