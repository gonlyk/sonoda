import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body id="sonoda">
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        // https://ant.design/docs/react/compatible-style-cn#styleprovider
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  // global style 不应该受到postcss自定义前缀影响
  const global = `
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
  `
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: global }} />
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;