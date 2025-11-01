// app/layout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Pardis Dashboard",
  description: "Helli4 Exam Viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 overflow-auto">{children}</div>
      </body>
    </html>
  );
}
