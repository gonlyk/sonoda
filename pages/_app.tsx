import type { AppProps } from 'next/app'
import '../asserts/layout.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}