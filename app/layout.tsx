import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import Menubar from "@/components/Menubar";
import Container from "@/components/Container";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import SideModal from "@/components/modal/SideModal";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { getCurrentUser } from "./actions/getCurrentUser";
import { getSubscriptions } from "./actions/getSubscriptions";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "YouTube-Clone",
  description: "YouTube Clone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  const channels = await getSubscriptions();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />

        <Container>
          <Header currentUser={currentUser} />

          <Menubar currentUser={currentUser} />

          <div className="xl:hidden">
            <SideModal currentUser={currentUser} channels={channels} />
          </div>

          <div className="hidden xl:block fixed top-14 h-screen w-[250px] overflow-y-auto">
            <Sidebar currentUser={currentUser} channels={channels} />
          </div>

          <ModalProvider currentUser={currentUser} />

          <main className="w-screen h-screen pt-14 md:pl-24 xl:pl-[250px] overflow-y-auto">
            {children}
          </main>
        </Container>
      </body>
    </html>
  );
}
