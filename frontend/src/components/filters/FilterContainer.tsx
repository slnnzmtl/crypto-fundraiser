import { motion } from "framer-motion";
import { filterVariants } from "./animations";

interface FilterContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
  isOpen,
  children,
}) => (
  <>
    <motion.div
      variants={filterVariants}
      initial="closed"
      animate={isOpen ? "openMobile" : "closedMobile"}
      className="overflow-hidden flex-shrink-0 md:sticky top-24 self-start h-fit w-full md:hidden"
    >
      {children}
    </motion.div>

    <motion.div
      variants={filterVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="overflow-hidden flex-shrink-0 md:sticky top-24 self-start h-fit w-full hidden md:block"
    >
      {children}
    </motion.div>
  </>
);
