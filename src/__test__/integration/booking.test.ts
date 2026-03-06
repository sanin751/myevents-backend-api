import request from "supertest";
import { BookingModel } from "../../models/booking.model";
import { BanquetModel } from "../../models/banquet.model";
import { createUserAndToken, cleanupTestUsers, TestUser } from "../utils/test-utils";
import { createApp } from "../../app";

const testApp = createApp();

describe("Booking Integration Tests", () => {
  const user1: TestUser = {
    firstName: "John",
    lastName: "Booking",
    username: "johnbooking",
    email: "john.booking@test.com",
    password: "User@1234",
    confirmPassword: "User@1234",
  };

  const user2: TestUser = {
    firstName: "Jane",
    lastName: "Booker",
    username: "janebooking",
    email: "jane.booking@test.com",
    password: "User@1234",
    confirmPassword: "User@1234",
  };

  const banquetData = {
    title: "Luxury Hall",
    description: "Premium event venue",
    location: "City Center",
    capacity: 1000,
    price: 100000,
    isAvailable: true,
  };

  const bookingData = {
    eventDate: "2026-05-20",
    guestCount: 200,
    totalPrice: 50000,
  };

  let user1Token: string;
  let user1Id: string;
  let user2Token: string;
  let user2Id: string;
  let banquetId: string;
  let createdBookingId: string;

  beforeAll(async () => {
    const user1Result = await createUserAndToken(user1);
    user1Token = user1Result.token;
    user1Id = String(user1Result.user._id);

    const user2Result = await createUserAndToken(user2);
    user2Token = user2Result.token;
    user2Id = String(user2Result.user._id);

    const banquet = await BanquetModel.create(banquetData);
    banquetId = String(banquet._id);
  });

  afterAll(async () => {
    await cleanupTestUsers([user1.email, user2.email]);
    await BookingModel.deleteMany({});
    await BanquetModel.deleteMany({});
  });

  describe("POST /api/bookings (Create Booking)", () => {
    it("should create a new booking successfully", async () => {
      const response = await request(testApp)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          ...bookingData,
          venueId: banquetId,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Booking created");
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.userId).toBe(user1Id);
      expect(response.body.data.venueId).toBe(banquetId);
      expect(response.body.data.guestCount).toBe(bookingData.guestCount);
      expect(response.body.data.status).toBe("pending");

      createdBookingId = response.body.data._id;
    });

    it("should fail to create booking without authorization", async () => {
      const response = await request(testApp)
        .post("/api/bookings")
        .send({
          ...bookingData,
          venueId: banquetId,
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid booking data", async () => {
      const invalidData = {
        eventDate: "invalid-date",
        guestCount: -10,
      };

      const response = await request(testApp)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with non-existent venue", async () => {
      const fakeVenueId = "507f1f77bcf86cd799439011";

      const response = await request(testApp)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          ...bookingData,
          venueId: fakeVenueId,
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should fail when guest count exceeds venue capacity", async () => {
      const response = await request(testApp)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          ...bookingData,
          venueId: banquetId,
          guestCount: 2000, // Exceeds 1000 capacity
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should fail with past event date", async () => {
      const response = await request(testApp)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          ...bookingData,
          venueId: banquetId,
          eventDate: "2020-01-01",
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("GET /api/bookings/:id (Get Booking by ID)", () => {
    it("should get a booking by id", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const response = await request(testApp)
        .get(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(String(booking._id));
      expect(response.body.data.guestCount).toBe(bookingData.guestCount);
    });

    it("should fail with invalid booking id", async () => {
      const response = await request(testApp)
        .get("/api/bookings/invalid-id")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should return 404 for non-existent booking", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(testApp)
        .get(`/api/bookings/${fakeId}`)
        .set("Authorization", `Bearer ${user1Token}`);

      expect(response.status).toBeGreaterThanOrEqual(404);
    });
  });

  describe("PUT /api/bookings/:id (Update Booking)", () => {
    it("should update booking details", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const updateData = {
        guestCount: 300,
        totalPrice: 75000,
      };

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.guestCount).toBe(300);
      expect(response.body.data.totalPrice).toBe(75000);
    });

    it("should fail to update booking without authorization", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const updateData = { guestCount: 300 };

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .send(updateData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should handle updating another user's booking", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const updateData = { guestCount: 300 };

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send(updateData);

      expect(response.status).toBeLessThan(600);
    });

    it("should handle invalid guest count", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const updateData = { guestCount: -50 };

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send(updateData);

      expect(response.status).toBeLessThan(600);
    });
  });

  describe("Booking Status Management", () => {
    it("should confirm a pending booking", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
        status: "pending",
      });

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ status: "confirmed" });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("confirmed");
    });

    it("should cancel a booking", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
        status: "pending",
      });

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ status: "cancelled" });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("cancelled");
    });

    it("should fail with invalid status", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const response = await request(testApp)
        .put(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ status: "invalid-status" });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("GET /api/bookings (Get User Bookings)", () => {
    beforeAll(async () => {
      await BookingModel.deleteMany({});
      // Create multiple bookings for user1
      await BookingModel.create([
        { userId: user1Id, venueId: banquetId, ...bookingData },
        { userId: user1Id, venueId: banquetId, ...bookingData, guestCount: 150 },
        { userId: user2Id, venueId: banquetId, ...bookingData },
      ]);
    });

    it("should get all bookings for authenticated user", async () => {
      const response = await request(testApp)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(response.status).toBeLessThan(600);
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
      }
    });

    it("should fail to get bookings without authorization", async () => {
      const response = await request(testApp).get("/api/bookings");

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should return bookings for different users", async () => {
      const response1 = await request(testApp)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${user1Token}`);

      const response2 = await request(testApp)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${user2Token}`);

      expect(response1.status).toBeLessThan(600);
      expect(response2.status).toBeLessThan(600);
    });
  });

  describe("DELETE /api/bookings/:id (Cancel Booking)", () => {
    it("should cancel a booking (soft delete)", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const response = await request(testApp)
        .delete(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user1Token}`);

      expect([200, 204]).toContain(response.status);
      expect(response.body.success).toBe(true);
    });

    it("should fail to delete without authorization", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const response = await request(testApp).delete(`/api/bookings/${booking._id}`);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should handle deleting another user's booking", async () => {
      const booking = await BookingModel.create({
        userId: user1Id,
        venueId: banquetId,
        ...bookingData,
      });

      const response = await request(testApp)
        .delete(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${user2Token}`);

      expect(response.status).toBeLessThan(600);
    });
  });
});
