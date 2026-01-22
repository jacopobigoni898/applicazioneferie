import { http } from "./httpClient";
import { AuthResponse } from "./types";
import { mapAuthResponseToUser } from "../domain/mappers/userMapper";
import type { User } from "../domain/entities/User";

// Chiamata di login Microsoft: ritorna l'entità User mappata dal DTO API
export const fetchMicrosoftLogin = async (): Promise<User> => {
  const { data } = await http.get<AuthResponse>("/Auth/microsoft-login");
  return mapAuthResponseToUser(data);
};
