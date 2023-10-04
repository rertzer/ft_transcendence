import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
	signin(){
		return {msg:"I ve sign in"}
	}

	signup() {
		return {msg: "I ve sign up"}
	}
}
