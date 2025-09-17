// Import { useForm } from "react-hook-form";
// Import { yupResolver } from "@hookform/resolvers/yup";
// Import { useDispatch, useSelector } from "react-redux";
// Import * as yup from "yup";
// Import { axiosClient } from "../common/axios";
// Import { remove, save } from "../redux/slices/userSlice";
// Import { RootState } from "../redux/store";
// Import { toast } from "react-toastify";
// Import { useState } from "react";
// Import { useNavigate } from "react-router-dom";
// Import { logout } from "../redux/slices/authSlice";
// Import { addDelay } from "@/lib/utils";

// Const schema = yup.object().shape({
//   Name: yup.string(),
//   Email: yup.string().email(),
//   Username: yup.string(),
//   PhoneNumber: yup.string(),
//   Bio: yup.string(),
// });

// Interface SettingsForm {
//   Name?: string;
//   Email?: string;
//   Username?: string;
//   PhoneNumber?: string;
//   Bio?: string;
// }

// Export const useSettings = () => {
//   Const [isLoading, setIsLoading] = useState(false);
//   Const user = useSelector((state: RootState) => state.user);
//   Const navigate = useNavigate();
//   Const dispatch = useDispatch();
//   Const {
//     Register,
//     HandleSubmit,
//     FormState: { errors },
//   } = useForm<SettingsForm>({
//     Resolver: yupResolver(schema),
//     DefaultValues: {
//       Name: user.name || "",
//       Email: user.email || "",
//       PhoneNumber: user.phoneNumber || "",
//       Bio: user.bio || "",
//     },
//   });

//   Const onSubmit = async (submitData: SettingsForm) => {
//     Try {
//       SetIsLoading(true);
//       Const { data } = await axiosClient.put(`/users/${user.id}`, submitData);
//       Dispatch(
//         Save({
//           Id: data.uuid,
//           Email: data.email,
//           Name: data.name,
//           PhoneNumber: data.phoneNumber,
//           Bio: data.bio,
//         }),
//       );
//       Await addDelay(500);
//       Toast.success("Settings updated successfully");
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       Logger.error(error.message || "Login failed");
//     } finally {
//       SetIsLoading(false);
//     }
//   };

//   Const deleteAccount = async () => {
//     Try {
//       SetIsLoading(true);
//       Await axiosClient.delete(`/users/${user.id}`);
//     } catch (error) {
//       Logger.error("Error deleting account:", error);
//     } finally {
//       SetIsLoading(true);
//       Toast.success("Account deleted successfully");
//       Dispatch(logout());
//       Dispatch(remove());
//       Navigate("/login");
//     }
//   };

//   Return {
//     Register,
//     HandleSubmit,
//     OnSubmit,
//     Errors,
//     IsLoading,
//     DeleteAccount,
//   };
// };
