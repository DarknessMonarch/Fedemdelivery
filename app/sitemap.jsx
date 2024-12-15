export default function sitemap() {
  return [
    {
      url: "https://fxdelivery.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: "https://fxdelivery.vercel.app/authentication/login",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/authentication/verification",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/authentication/signup",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/authentication/reset",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/authentication/forgot",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/authentication/resetCode",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/page/dashboard",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    },

    {
      url: "https://fxdelivery.vercel.app/page/about",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: "https://fxdelivery.vercel.app/page/not-found",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
  ];
}
