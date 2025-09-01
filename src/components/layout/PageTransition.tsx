import React from 'react'
import { motion, spring, easeInOut } from "framer-motion";
export const PageTransition = ({children}: {children: React.ReactNode}) => {
  
    const transition = {
      type: spring,
      ease: easeInOut,
      transition: { duration: 0.3 },
    };
    return (
    <motion.div
        initial={{ opacity: 0, y: -10}}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
    >
    {children}
    </motion.div>
  )
}
