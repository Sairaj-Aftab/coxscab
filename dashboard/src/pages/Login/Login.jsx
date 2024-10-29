import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authData, setMessageEmpty } from "@/features/auth/authSlice";
import { loginAuthUser } from "@/features/auth/authApiSlice";
import { useEffect } from "react";

const formSchema = z.object({
  userName: z.string().min(3, {
    message: "User name is required!",
  }),
  password: z.string().min(4, {
    message: "Password is required!",
  }),
});

const Login = () => {
  const dispatch = useDispatch();
  const { error, loader, success, message } = useSelector(authData);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    dispatch(
      loginAuthUser({ userName: data.userName, password: data.password })
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      form.reset();
      navigate("/");
    }
    if (error || success || message) {
      dispatch(setMessageEmpty());
    }
  }, [error, message, success, dispatch, navigate, form]);

  return (
    <div className="py-5 flex justify-center items-center h-screen">
      <Card className={cn("w-[95%] sm:w-[480px]")}>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form} className="w-full">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 sm:space-y-2"
            >
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        loader && "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      User name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loader} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        loader && "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={loader} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loader}>
                {loader ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
