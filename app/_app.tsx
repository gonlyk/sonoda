import type { AppProps } from 'next/app'
import '../asserts/layout.scss';
import '../asserts/antd.scss';
import { ConfigProvider } from 'antd';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <ConfigProvider componentSize="small">
    <Component {...pageProps} />
  </ConfigProvider>
}