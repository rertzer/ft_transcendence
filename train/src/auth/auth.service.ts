import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService){}
	signin(){
		
		return {msg:"I ve sign in"}
	}

	signup() {
		return {msg: "I ve sign up"}
	}
}
