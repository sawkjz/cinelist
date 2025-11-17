import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "./hooks/useAuth";
import AuthLayout from "./components/AuthLayout";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

const AuthPage = () => {
  const { isLoading, handleSignIn, handleSignUp } = useAuth();

  return (
    <AuthLayout>
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Cadastrar</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="signup">
          <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default AuthPage;
