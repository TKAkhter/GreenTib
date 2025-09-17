import { JwtPayload } from "jwt-decode";
import { ReactNode } from "react";
export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface DecodedToken {
  exp: number; // Token expiration time in seconds since the epoch
}

export interface LayoutProps {
  children: ReactNode;
}
