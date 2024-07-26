'use client'
import { AntDesignOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import { type ReactNode } from 'react';
import { layoutData } from '../../store/layout';
import { tableListData } from '../../store/tableList';
import { useRouter, usePathname } from 'next/navigation';
import { type SonodaTable } from '../../server/model/table';
import { hydrateOnce } from '../../store/hydrate';

const { Header, Footer, Sider, Content } = Layout;

function CommonLayout({ tables, children }: {
  tables: Required<SonodaTable>[]
  children: ReactNode
}) {
  hydrateOnce(CommonLayout, () => {
    tableListData.tables = tables
  })
  const router = useRouter()
  const pathname = usePathname()

  return (
    <ConfigProvider componentSize="small">
      <Layout>
        <Header className="header">
          <div className="icon">
            <AntDesignOutlined />
            <span>Sonoda</span>
          </div>
        </Header>
        <Layout>
          <Sider className="sider">
            <Menu className="menu"
              items={tableListData.menu}
              selectedKeys={[pathname!]}
              onSelect={({ key }) => {
                router.push(key)
              }} />
          </Sider>
          <Content className="content">{children}</Content>
        </Layout>
        <Footer className="footer"
          style={{ opacity: layoutData.showFooterHint ? 1 : 0 }}>
          {layoutData.footerHint}</Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default observer(CommonLayout)
