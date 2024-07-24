export const metadata = {
  title: "Goat Attack",
  description: "Prank your friends with GoatAttack! Barrage their phone with goat pictures and puns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body>
        <div className="">
          {children}
        </div>
      </body>
    </html>
  );
}