"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = MotionProps & {
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export default function Reveal({ className, children, delay = 0, ...rest }: Props) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
