import Navbar from "./Navbar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="p-5 shadow-sm shadow-secondary">
        <Navbar />
      </div>
      {children}
    </>
  );
}

export default RootLayout;
