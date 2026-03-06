import request from "supertest";
import { PhotographyPackageModel } from "../../models/photography.model";
import { createUserAndToken, cleanupTestUsers, TestUser } from "../utils/test-utils";
import { createApp } from "../../app";

const testApp = createApp();

describe("Photography Integration Tests", () => {
  const adminUser: TestUser = {
    firstName: "Admin",
    lastName: "Photography",
    username: "adminphoto",
    email: "admin.photo@test.com",
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
    await PhotographyPackageModel.deleteMany({});
  });

  describe("Photography Endpoints", () => {
    it("should handle GET /api/photography", async () => {
      const response = await request(testApp).get("/api/photography");
      expect(response.status).toBeLessThan(500);
    });

    it("should reject POST without authorization", async () => {
      const response = await request(testApp)
        .post("/api/photography")
        .send({ title: "Test Package" });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
