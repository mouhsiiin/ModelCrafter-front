import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export const GuestAccess: React.FC = () => {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  const handleGuestAccess = () => {
    continueAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Guest Access</CardTitle>
          <CardDescription>Try out the platform without an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              As a guest, you can create one temporary project that won't be saved.
              Create an account to save your work and access all features.
            </AlertDescription>
          </Alert>
          <Button onClick={handleGuestAccess} className="w-full">
            Continue as Guest
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};