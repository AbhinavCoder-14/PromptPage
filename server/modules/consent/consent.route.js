import express, { Router } from "express";
import { saveConsent } from "./consent.controller";


const consentRoute = express.Router()


consentRoute.post("/",saveConsent)


export default consentRoute

