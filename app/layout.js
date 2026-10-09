import { AuthProvider } from "../components/AuthProvider";
import AppShell from "../components/AppShell";
import "./globals.css";

export const metadata = {
  title: "My Ecommerce",
  description: "Ecommerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
