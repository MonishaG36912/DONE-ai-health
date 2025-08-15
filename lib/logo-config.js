// Logo configuration and variants
export const logoConfig = {
  // Main logo with SVG
  main: {
    src: "/logos/mainPoster.png",
    alt: "Period Tracker Logo",
    width: 40,
    height: 40
  },
  
  // Icon only (for mobile/compact view)
  icon: {
    showIcon: true,
    showText: false,
    width: 32,
    height: 32
  },
  
  // Text only
  textOnly: {
    showIcon: false,
    showText: true
  },
  
  // Custom image logo (replace with your own)
  custom: {
    src: "/logos/mainPoster.png", // Add your own logo here
    alt: "Period Tracker",
    width: 120,
    height: 40
  }
};

// You can easily switch between logo variants by changing this
export const currentLogo = logoConfig.main;
