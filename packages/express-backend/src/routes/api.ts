import express from "express";
import { authenticateUser } from "../auth";
import profileRouter from "./profiles";

const router = express.Router();

// all routes under this router require authentication
router.use(authenticateUser);

router.use("/profiles", profileRouter);

export default router;