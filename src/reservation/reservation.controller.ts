import { Controller } from "@nestjs/common";
import { ReservationService } from "./reservation.service";

@Controller("reservations/")
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService
    ) { }
}