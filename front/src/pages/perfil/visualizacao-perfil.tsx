import { useUser } from "@/context/UserContext";
import { User, Mail, Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

//interface do usuário
interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export default function ProfileView() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="ml-3 text-lg text-gray-600">A carregar perfil...</p>
      </div>
    );
  }

  const userData = user as UserData | null;

  if (!userData) {
    // ...
  }

  // ...
}

}

