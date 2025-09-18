import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { settingsSchema, SettingsSchema } from "@/schemas/settings.schema";
const PhoneInput = React.lazy(() => import('react-phone-number-input'));
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { remove, save } from "@/redux/slices/userSlice";
import { deleteUsersById, getUsersById, putUsersById } from "@/generated";
import { RootState } from "@/redux/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { logout } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import logger from "@/common/pino";

const Settings: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [account, setAccount] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = async (submittedData: SettingsSchema) => {

    setLoading(true);
    const loadingToast = toast.loading("Updating account...");

    try {
      const { data: userResponse, error } = await putUsersById({
        path: { id: userId },
        body: {
          name: submittedData.name,
          phoneNumber: submittedData.phone,
          bio: submittedData.bio,
        }
      });
      if (!userResponse?.success) {
        throw error;
      }

      toast.success("Account updated successfully", { id: loadingToast });
      dispatch(save(userResponse?.data!));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(error.message);
      toast.error(`Account update failed: ${error.message}`, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {

    setLoading(true);
    const loadingToast = toast.loading("Deleting account...");

    try {
      const { data: userResponse, error } = await deleteUsersById({
        path: { id: userId },
      });
      if (!userResponse?.success) {
        throw error;
      }

      toast.success("Account deleted successfully", { id: loadingToast });
      dispatch(logout());
      dispatch(remove());
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(error.message);
      toast.error(`Account deleted failed: ${error.message}`, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);
      const loadingToast = toast.loading("Fetching user data...");

      try {
        const { data: userResponse, error } = await getUsersById({
          path: { id: userId },
        });
        if (!userResponse?.success) {
          throw error;
        }

        const updatedAccount = {
          name: userResponse.data!.name,
          email: userResponse.data!.email,
          phone: userResponse.data!.phoneNumber,
          bio: userResponse.data!.bio,
        };
        setAccount(updatedAccount);
        reset(updatedAccount);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logger.error(error.message);
        toast.error(`Fetch user data failed: ${error.message}`, { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-8 p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.name.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" disabled placeholder="you@example.com" />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="mb-2">
                Phone Number
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    international
                    defaultCountry="US"
                    className="react-phone-input"
                    placeholder="+1 123 456 7890"
                  />
                )}
              />
              {errors.phone && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.phone.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="mb-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                rows={4}
                {...register("bio")}
                placeholder="Tell us about yourself"
                className="border-input rounded-md px-3 py-2 w-full text-sm bg-background text-foreground"
              />
              {errors.bio && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.bio.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-6 justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="w-full lg:w-1/3">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive mb-4">
              Deleting your account will also delete all images you have uploaded.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  {" "}
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your image and remove
                    your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
