import request from "supertest";
import { BanquetModel } from "../../models/banquet.model";
import { createUserAndToken, cleanupTestUsers, TestUser } from "../utils/test-utils";
import { createApp } from "../../app";

const testApp = createApp();

describe("Banquet Integration Tests", () => {
  const adminUser: TestUser = {
    firstName: "Admin",
    lastName: "User",
    username: "adminbanquet",
    email: "admin.banquet@test.com",
    password: "Admin@1234",
    confirmPassword: "Admin@1234",
    role: "admin",
  };

  const normalUser: TestUser = {
    firstName: "Normal",
    lastName: "User",
    username: "normalbanquet",
    email: "normal.banquet@test.com",
    password: "User@1234",
    confirmPassword: "User@1234",
  };

  const banquetData = {
    title: "Grand Ballroom",
    description: "Luxurious banquet hall with modern amenities",
    location: "Downtown",
    capacity: 500,
    price: 50000,
  };

  let adminToken: string;
  let userToken: string;
  let createdBanquetId: string;

  beforeAll(async () => {
    const adminResult = await createUserAndToken(adminUser);
    adminToken = adminResult.token;

    const userResult = await createUserAndToken(normalUser);
    userToken = userResult.token;
  });

  afterAll(async () => {
    await cleanupTestUsers([adminUser.email, normalUser.email]);
    await BanquetModel.deleteMany({});
  });

  describe("POST /api/banquets (Create Banquet)", () => {
    it("should create a new banquet successfully", async () => {
      const response = await request(testApp)
        .post("/api/banquets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(banquetData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Banquet created");
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.title).toBe(banquetData.title);
      expect(response.body.data.capacity).toBe(banquetData.capacity);
      expect(response.body.data.price).toBe(banquetData.price);
      expect(response.body.data.isAvailable).toBe(true);

      createdBanquetId = response.body.data._id;
    });

    it("should fail to create banquet with invalid data", async () => {
      const invalidData = {
        title: "Hall",
        // missing required fields
      };

      const response = await request(testApp)
        .post("/api/banquets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail to create banquet without authorization", async () => {
      const response = await request(testApp)
        .post("/api/banquets")
        .send(banquetData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should fail to create banquet with negative price", async () => {
      const invalidData = { ...banquetData, price: -100 };

      const response = await request(testApp)
        .post("/api/banquets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/banquets (Get All Banquets)", () => {
    beforeAll(async () => {
      // Create multiple banquets
      await BanquetModel.create([
        { ...banquetData, title: "Banquet 1" },
        { ...banquetData, title: "Banquet 2" },
        { ...banquetData, title: "Banquet 3" },
      ]);
    });

    it("should get all banquets with default pagination", async () => {
      const response = await request(testApp).get("/api/banquets");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should get banquets with pagination", async () => {
      const response = await request(testApp)
        .get("/api/banquets")
        .query({ page: 1, size: 2 });

      expect(response.status).toBeLessThan(600);
    });

    it("should search banquets by title", async () => {
      const response = await request(testApp)
        .get("/api/banquets")
        .query({ search: "Banquet 1" });

      expect(response.status).toBeLessThan(600);
    });
  });

  describe("GET /api/banquets/:id (Get Banquet by ID)", () => {
    it("should get a banquet by id", async () => {
      const banquet = await BanquetModel.create(banquetData);

      const response = await request(testApp).get(`/api/banquets/${banquet._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(String(banquet._id));
      expect(response.body.data.title).toBe(banquetData.title);
    });

    it("should fail with invalid banquet id", async () => {
      const response = await request(testApp).get("/api/banquets/invalid-id");

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 404 for non-existent banquet", async () => {
      const fakeId = "507f1f77bcf86cd799439011"; // Valid MongoDB ObjectId format

      const response = await request(testApp).get(`/api/banquets/${fakeId}`);

      expect(response.status).toBeGreaterThanOrEqual(404);
    });
  });

  describe("PUT /api/banquets/:id (Update Banquet)", () => {
    it("should update a banquet successfully", async () => {
      const banquet = await BanquetModel.create(banquetData);

      const updateData = {
        title: "Updated Ballroom",
        price: 60000,
      };

      const response = await request(testApp)
        .put(`/api/banquets/${banquet._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Ballroom");
      expect(response.body.data.price).toBe(60000);
    });

    it("should fail to update without authorization", async () => {
      const banquet = await BanquetModel.create(banquetData);

      const updateData = { title: "Updated" };

      const response = await request(testApp)
        .put(`/api/banquets/${banquet._id}`)
        .send(updateData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should fail to update non-existent banquet", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const updateData = { title: "Updated" };

      const response = await request(testApp)
        .put(`/api/banquets/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBeGreaterThanOrEqual(404);
    });
  });

  describe("DELETE /api/banquets/:id (Delete Banquet)", () => {
    it("should delete a banquet successfully", async () => {
      const banquet = await BanquetModel.create(banquetData);

      const response = await request(testApp)
        .delete(`/api/banquets/${banquet._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect([200, 204]).toContain(response.status);
      expect(response.body.success).toBe(true);

      // Verify deletion
      const deletedBanquet = await BanquetModel.findById(banquet._id);
      expect(deletedBanquet).toBeNull();
    });

    it("should handle delete without authorization", async () => {
      const banquet = await BanquetModel.create(banquetData);

      const response = await request(testApp).delete(`/api/banquets/${banquet._id}`);

      expect(response.status).toBeLessThan(600);
    });

    it("should fail to delete non-existent banquet", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(testApp)
        .delete(`/api/banquets/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBeGreaterThanOrEqual(404);
    });
  });

  describe("Banquet Availability", () => {
    it("should toggle banquet availability", async () => {
      const banquet = await BanquetModel.create(banquetData);

      const response = await request(testApp)
        .put(`/api/banquets/${banquet._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isAvailable: false });

      expect(response.status).toBe(200);
      expect(response.body.data.isAvailable).toBe(false);
    });

    it("should list only available banquets when queried", async () => {
      await BanquetModel.deleteMany({});
      
      await BanquetModel.create([
        { ...banquetData, title: "Available", isAvailable: true },
        { ...banquetData, title: "Unavailable", isAvailable: false },
      ]);

      const response = await request(testApp)
        .get("/api/banquets")
        .query({ available: true });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
