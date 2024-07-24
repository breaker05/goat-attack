"use client";

import Header from "../components/ui/header";
import Footer from "../components/ui/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Header />
        <main>{children}</main>
      <Footer border={true} />
    </>
  );
}