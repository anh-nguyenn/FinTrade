import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import {
  LoginRequest,
  RegisterRequest,
  JwtResponse,
  User,
} from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiUrl}/auth/signin`, loginRequest)
      .pipe(
        tap((response) => {
          localStorage.setItem("token", response.token);
          this.setCurrentUser(response);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, registerRequest);
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "ADMIN";
  }

  private setCurrentUser(jwtResponse: JwtResponse): void {
    const user: User = {
      id: jwtResponse.id,
      username: jwtResponse.username,
      email: jwtResponse.email,
      firstName: jwtResponse.firstName,
      lastName: jwtResponse.lastName,
      role: jwtResponse.roles[0]?.replace("ROLE_", "") || "USER",
      enabled: true,
      createdAt: "",
      updatedAt: "",
    };
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      // In a real app, you might want to decode the JWT token to get user info
      // For now, we'll just check if token exists
      // You could implement JWT decoding here
    }
  }
}
