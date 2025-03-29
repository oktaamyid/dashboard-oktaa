"use client";

import { useEffect, useState } from "react";
import Card from '@/components/ui/card';

interface AnimatedStatsCardProps {
     title: string;
     finalValue: number;
     icon: React.ComponentType<{ className?: string }>;
     isLoading?: boolean;
     duration?: number;
     className?: string;
}

export default function AnimatedStatsCard({
     title,
     finalValue,
     icon,
     isLoading = false,
     duration = 500,
     className
}: AnimatedStatsCardProps) {
     const [count, setCount] = useState(0);

     useEffect(() => {
          if (isLoading || finalValue === 0) {
               return;
          }

          setCount(0);

          const steps = 20;
          const stepValue = finalValue / steps;
          let currentStep = 0;

          const interval = setInterval(() => {
               currentStep++;

               setCount(() => {
                    const newValue = Math.min(Math.round(stepValue * currentStep), finalValue);
                    return newValue;
               });

               if (currentStep >= steps) {
                    clearInterval(interval);
                    setCount(finalValue);
               }
          }, duration / steps);

          return () => clearInterval(interval);
     }, [finalValue, isLoading, duration]);

     return (
          <Card
               title={title}
               value={isLoading ? "0" : count.toString()}
               icon={icon}
               className={className}
          />
     );
}