"use client"

import { motion } from "framer-motion";

export default function AnimatedTitle() {
  return (
    <div className="flex align-center justify-center pt-2">
<motion.div 
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
>
  <h1 className=" w-full text-4xl bg-clip-text text-white text-center">
    Welcome to the Plumbing Market
  </h1>
</motion.div>

    </div>

  );
}
