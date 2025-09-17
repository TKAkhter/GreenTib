import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addDelay, isTokenValid } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthLogin } from "@/generated";
import { toast } from "sonner";
import { login } from "@/redux/slices/authSlice";
import { save } from "@/redux/slices/userSlice";
import { authSchema, AuthSchema } from "@/schemas/auth.schema";
import logger from "@/common/pino";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (submittedData: AuthSchema) => {
    setLoading(true);
    const loadingToast = toast.loading("Logging in...");
    try {
      const { data, error } = await postAuthLogin({ body: submittedData });

      if (error) {
        const errorMessage = (error as { message?: string }).message || "An unknown error occurred";
        throw new Error(errorMessage);
      }

      dispatch(login(data!.data!.token));
      dispatch(save(data!.data!.user));

      toast.success("Login successful!", { id: loadingToast });
      await addDelay(500);
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(error.message);
      toast.error("Login failed. Email or Password is not correct.", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTokenValid(token)) {
      navigate("/dashboard");
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" type="text" placeholder="Enter your email" {...register("email")} />
              {errors.email && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.email.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span
              className="text-primary hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
