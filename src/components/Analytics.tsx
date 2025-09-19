"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: { [key: string]: any }
    ) => void;
  }
}

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();

  useEffect(() => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, GA_MEASUREMENT_ID]);

  // Track algorithm interactions
  const trackAlgorithmInteraction = (
    action: string,
    algorithm: string,
    category = "engagement"
  ) => {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: algorithm,
        custom_parameter_1: "algorithm_interaction",
      });
    }
  };

  // Track learning milestones
  const trackLearningMilestone = (
    milestone: string,
    progressPercentage: number
  ) => {
    if (window.gtag) {
      window.gtag("event", "learning_milestone", {
        event_category: "education",
        event_label: milestone,
        custom_parameter_1: progressPercentage,
      });
    }
  };

  // Track page engagement time
  const trackPageEngagement = (timeOnPage: number) => {
    if (window.gtag) {
      window.gtag("event", "page_engagement", {
        event_category: "engagement",
        custom_parameter_1: timeOnPage,
      });
    }
  };

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              custom_map: {'custom_parameter_1': 'custom_dimension_1'}
            });
          `,
        }}
      />
    </>
  );
}

// Export tracking functions for use in other components
export {
  trackAlgorithmInteraction,
  trackLearningMilestone,
  trackPageEngagement,
};

// Hook for tracking algorithm interactions
export function useAlgorithmTracking() {
  return {
    trackStart: (algorithm: string) =>
      trackAlgorithmInteraction("start", algorithm),
    trackPause: (algorithm: string) =>
      trackAlgorithmInteraction("pause", algorithm),
    trackComplete: (algorithm: string) =>
      trackAlgorithmInteraction("complete", algorithm),
    trackReset: (algorithm: string) =>
      trackAlgorithmInteraction("reset", algorithm),
    trackSpeedChange: (algorithm: string, speed: number) => {
      if (window.gtag) {
        window.gtag("event", "speed_change", {
          event_category: "interaction",
          event_label: algorithm,
          custom_parameter_1: speed,
        });
      }
    },
  };
}

function trackAlgorithmInteraction(
  action: string,
  algorithm: string,
  category = "engagement"
) {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: algorithm,
      custom_parameter_1: "algorithm_interaction",
    });
  }
}

function trackLearningMilestone(milestone: string, progressPercentage: number) {
  if (window.gtag) {
    window.gtag("event", "learning_milestone", {
      event_category: "education",
      event_label: milestone,
      custom_parameter_1: progressPercentage,
    });
  }
}

function trackPageEngagement(timeOnPage: number) {
  if (window.gtag) {
    window.gtag("event", "page_engagement", {
      event_category: "engagement",
      custom_parameter_1: timeOnPage,
    });
  }
}
