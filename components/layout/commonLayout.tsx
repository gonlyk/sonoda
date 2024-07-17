import { AntDesignOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import { type ReactNode } from 'react';
import { layoutData } from '../../store/layout';

const { Header, Footer, Sider, Content } = Layout;

function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <Header className="header">
        <div className="icon">
          <AntDesignOutlined />
          <span>Sonoda</span>
        </div>
      </Header>
      <Layout>
        <Sider className="sider">
          <Menu items={[{
            key: 'abc',
            label: 'abc'
          }]} />
        </Sider>
        <Content className="content">{children}</Content>
      </Layout>
      <Footer className="footer"
        style={{ opacity: layoutData.showFooterHint ? 1 : 0 }}>
        {layoutData.footerHint}</Footer>
    </Layout>
  )
}

export default observer(CommonLayout)
