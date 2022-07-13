import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { MODULES, ROUTES } from '../../../common/constants';

const { Sider } = Layout;

function Sidebar({ location: { pathname }, history }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onMenuSelect = (e) => {
    history.push(e.key);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="gx-layout-sider-header">
        <div className="gx-linebar">
          <div className="gx-icon-btn icon pointer" onClick={toggle}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
        <Link to="/" className="gx-site-logo">
          {/* <img src={logo} alt="Put your logo here" /> */}
        </Link>
      </div>
      <div className="gx-sidebar-content">
        <Menu
          theme="lite"
          mode="inline"
          selectedKeys={[`/${pathname.split('/')[1]}`]}
          defaultSelectedKeys={[ROUTES.MAIN]}
          onSelect={onMenuSelect}
        >
          <Menu.Item key={ROUTES.MAIN} className="d-flex align-center">
            <HomeOutlined />
            <span>{MODULES.DASHBOARD}</span>
          </Menu.Item>
          <Menu.Item
            key={ROUTES.USERS_MANAGEMENT}
            className="d-flex align-center"
          >
            <UserOutlined />
            <span>{MODULES.USERS_MANAGEMENT}</span>
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
}

export default withRouter(Sidebar);
