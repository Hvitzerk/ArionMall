export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main">
      <div className="container">
        {children}
      </div>
    </main>
  );
} 