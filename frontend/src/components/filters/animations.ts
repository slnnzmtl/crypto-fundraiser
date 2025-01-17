export const filterVariants = {
  open: {
    width: "20rem",
    height: "auto",
    opacity: 1,
    transition: {
      width: { duration: 0.3 },
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  closed: {
    width: 0,
    height: 0,
    opacity: 0,
    transition: {
      width: { duration: 0.3 },
      height: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
  openMobile: {
    width: "100%",
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  closedMobile: {
    width: 0,
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
};
