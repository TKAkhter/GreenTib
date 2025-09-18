import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Logo } from "../Logo";
import { logout } from "@/redux/slices/authSlice";
import { remove } from "@/redux/slices/userSlice";
import { useTheme } from "next-themes";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { theme, setTheme } = useTheme();
  const initials = (user.name ? user.name : "T A")
    .trim()
    .split(/\s+/)
    .map((word: string) => word[0].toUpperCase())
    .join("");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(remove());
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full px-6 py-4 border-b bg-background flex items-center justify-between">
      {/* Logo */}
      <div
        onClick={goToDashboard}
        className="text-xl font-bold text-primary tracking-wide cursor-pointer"
      >
        <Logo />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 mt-2">
            <DropdownMenuLabel>{initials}</DropdownMenuLabel>
            <Label className="px-2 py-1.5 dark:text-white text-gray-500">{user.email}</Label>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
