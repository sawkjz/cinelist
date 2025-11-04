import { LoginForm } from '../components/LoginForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
