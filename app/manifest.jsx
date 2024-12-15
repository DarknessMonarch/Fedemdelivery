export default function manifest() {
    return {
      name: 'fxdelivery',
      short_name: 'fxdelivery',
      description: 'Anywhere, Anytime – We Deliver the World to You!',
      start_url: '/' || '/page/home',
      display: 'standalone',
      background_color: '#11191fff',
      theme_color: '#11191fff',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }