import { User, UserRole } from "../entities/User";
import type { AuthResponse } from "../../api/types";

// Mappa il DTO di login in un'entità di dominio User
export const mapAuthResponseToUser = (dto: AuthResponse): User => {
  const normalizedRole = dto.ruolo?.toLowerCase() ?? "";
  const role: UserRole = normalizedRole === "admin" ? UserRole.ADMIN : UserRole.USER;

  return {
    id: String(dto.idUtente),
    name: dto.nome,
    surname: dto.cognome,
    email: dto.email,
    role,
  };
};
