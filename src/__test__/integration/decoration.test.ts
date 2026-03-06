import request from "supertest";
import { DecorationModel } from "../../models/decoration.model";
import { createUserAndToken, cleanupTestUsers, TestUser } from "../utils/test-utils";
import { createApp } from "../../app";

const testApp = createApp();

describe("Decoration Integration Tests", () => {
  const adminUser: TestUser = {
    firstName: "Admin",
    lastName: "Decoration",
    username: "admindeco",
    email: "admin.deco@test.com",
    password: "Admin@1234",
    confirmPassword: "Admin@1234",
    role: "admin",
  };

  let adminToken: string;

  beforeAll(async () => {
    const adminResult = await createUserAndToken(adminUser);
    adminToken = adminResult.token;
  });

  afterAll(async () => {
    await cleanupTestUsers([adminUser.email]);
    await DecorationModel.deleteMany({});
  });

  describe("Decoration Endpoints", () => {
    it("should handle GET /api/decorations", async () => {
      const response = await request(testApp).get("/api/decorations");
      expect(response.status).toBeLessThan(500);
    });

    it("should reject POST without authorization", async () => {
      const response = await request(testApp)
        .post("/api/decorations")
        .send({ title: "Test" });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
