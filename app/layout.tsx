import '../asserts/layout.scss';
import '../asserts/antd.scss';
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // global style 不应该受到postcss自定义前缀影响
  const global = `
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
  `

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: global }} />
      </head>
      <body id="sonoda">
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html >
  )
}
