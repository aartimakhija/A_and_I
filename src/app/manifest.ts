import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A&I — Style With Us",
    short_name: "A&I",
    description: "Indian craft, global silhouette. Womenswear handmade in small runs across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F6F3",
    theme_color: "#1C1A18",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
