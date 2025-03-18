import {
  type HTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface DogProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface LoginCredentials {
  name: string;
  email: string;
}

export interface FetchRouteProps {
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export interface MatchedDogProps {
  dog: Dog;
  onClose: () => void;
}
