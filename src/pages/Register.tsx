import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addDelay, cn, isTokenValid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthRegister } from "@/generated";
import { toast } from "sonner";
import { login } from "@/redux/slices/authSlice";
import { save } from "@/redux/slices/userSlice";
import { registerSchema, RegisterSchema } from "@/schemas/auth.schema";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Register: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (submittedData: RegisterSchema) => {
    setLoading(true);
    const loadingToast = toast.loading("Creating account...");

    try {
      const { data, error } = await postAuthRegister({ body: submittedData });

      if (error) {
        const errorMessage = (error as { message?: string }).message || "An unknown error occurred";
        throw new Error(errorMessage);
      }

      dispatch(login(data!.data!.token));
      dispatch(save(data!.data!.user));

      toast.success("Account created successfully", { id: loadingToast });
      await addDelay(500);
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Account creation failed: ${error.message}`, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTokenValid(token)) {
      navigate("/dashboard");
    }
  }, [token]);

  const passwordRules = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[a-z]/, label: "One lowercase letter" },
    { regex: /[A-Z]/, label: "One uppercase letter" },
    { regex: /\d/, label: "One number" },
    { regex: /[@$!%*?&]/, label: "One special character" },
  ];

  const checkPasswordRule = (rule: { regex: RegExp }) => rule.regex.test(password);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input id="name" {...register("name")} placeholder="Your full name" />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{errors.name.message}</AlertTitle>
                </Alert>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
              {errors.email && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{errors.email.message}</AlertTitle>
                </Alert>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter a secure password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="space-y-1 text-sm mt-4">
                {passwordRules.map((rule, index) => (
                  <p
                    key={index}
                    className={cn(
                      "flex items-center gap-2",
                      checkPasswordRule(rule) ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {checkPasswordRule(rule) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    {rule.label}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="mb-2">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{errors.confirmPassword.message}</AlertTitle>
                </Alert>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <span
                className="text-primary hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
