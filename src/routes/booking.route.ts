import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { BookingController } from "../controllers/booking.controller";

const router = Router();

const bookingController = new BookingController();

// only login required
router.use(authorizedMiddleware);

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

export default router;