import { Card, CardContent, CardHeader } from "@/components/ui/card";
import logoImg from "../../assets/logo1.png";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
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
import { useEffect } from "react";
import useAuth from "@/store/useAuth";

const formSchema = z.object({
  userName: z.string().min(3, {
    message: "User name is required!",
  }),
  password: z.string().min(4, {
    message: "Password is required!",
  }),
});

const Login = () => {
  const {
    isAuthenticated,
    setLogin,
    loader,
    message,
    error,
    setAuthMessageEmpty,
  } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await setLogin({ userName: data.userName, password: data.password });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isAuthenticated) {
      form.reset();
      navigate("/");
    }
    if (error || message) {
      setAuthMessageEmpty();
    }
  }, [error, form, isAuthenticated, message, navigate, setAuthMessageEmpty]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/70 via-transparent to-red-500/70 p-4">
      <Card className={cn("w-full max-w-md shadow-md")}>
        <CardHeader className="space-y-1 flex flex-col items-center">
          <img src={logoImg} alt="COXSCAB" className="h-28 w-48 object-cover" />
          {/* <div className="w-32 h-32 relative mb-4"></div> */}
          <h2 className="text-2xl font-bold tracking-tight text-primary text-center">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access your account
          </p>
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
              <Button type="submit" disabled={loader} className="w-full">
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
