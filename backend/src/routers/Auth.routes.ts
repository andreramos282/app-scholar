import { Router } from "express";
import AuthController from "../controllers/Auth.controller";

class AuthRoutes {
    private controller = new AuthController();
    private router: Router = Router();

    constructor() {
        this.router.post("/login", this.controller.login.bind(this.controller));
        this.router.put("/change-password", this.controller.changePassword.bind(this.controller));
    }

    public getRouter() {
        return this.router;
    }
}

const authRoutes = new AuthRoutes().getRouter();
export default authRoutes;
