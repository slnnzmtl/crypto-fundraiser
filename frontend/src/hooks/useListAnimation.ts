import { ViewType } from '@interfaces';

export const useListAnimation = (viewType: ViewType) => {
  const containerVariants = {
    grid: {
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    },
    list: {
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    grid: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    list: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const getContainerClassName = () => 
    viewType === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-4';

  return {
    containerVariants,
    itemVariants,
    getContainerClassName
  };
}; 