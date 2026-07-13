/**
 * Repository interfaces for data access.
 *
 * These interfaces define the contract for data operations.
 * Implement them with your preferred database (Supabase, Prisma, Deno KV, etc.)
 *
 * See `memory.ts` for an in-memory reference implementation.
 */

/** Base entity with ID and timestamps. */
export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** User entity. */
export interface User extends Entity {
  email: string;
  name: string;
  role: "admin" | "editor" | "user";
  status: "active" | "inactive";
}

/** Generic repository interface. */
export interface Repository<T extends Entity> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/** User repository with user-specific queries. */
export interface UserRepository extends Repository<User> {
  getByEmail(email: string): Promise<User | null>;
}
