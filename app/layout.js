import "./globals.css";

export const metadata = {
  title: "CodePad Dark",
  description: "Post and share code snippets instantly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
