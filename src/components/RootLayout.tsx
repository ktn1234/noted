import Navbar from "./Navbar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="p-5 shadow-sm shadow-secondary">
        <Navbar />
      </header>
      {children}
    </>
  );
}

export default RootLayout;
