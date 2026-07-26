import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import AnimatedBackground from "./AnimatedBackground";

const AppLayout = ({ children }) => (
  <div className="relative min-h-screen">
    <AnimatedBackground />
    <Sidebar />
    <MobileNav />
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative z-10 md:ml-[17rem] px-4 md:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto"
    >
      {children}
    </motion.main>
  </div>
);

export default AppLayout;
