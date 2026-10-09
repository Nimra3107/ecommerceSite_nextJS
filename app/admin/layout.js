"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import { isAdminLoggedIn } from "../../lib/auth";

export default function AdminRootLayout({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace("/admin-login");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
