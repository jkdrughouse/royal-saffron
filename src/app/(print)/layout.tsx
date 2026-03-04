// Pass-through layout for the (print) route group.
// The root layout provides <html>/<body>; RootLayoutContent skips the
// site chrome (header/footer) for any path starting with /admin/receipt.
// This file exists only to satisfy Next.js route-group layout requirements.

export default function PrintLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
