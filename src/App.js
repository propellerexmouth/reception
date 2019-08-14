import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Layout, List, Card } from 'antd';
import axios from "axios";

import './App.css';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [resp, setRespData] = useState({ logs: null, tags: null });

  const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  useEffect(() => {
    const fetch1 = axios.get(`http://${process.env.REACT_APP_ENDPOINT}/logs`);
    const fetch2 = axios.get(`http://${process.env.REACT_APP_ENDPOINT}/tags`);
    Promise.all([fetch1, fetch2]).then(([res1, res2]) => {
      setRespData({ logs: res1.data.data, tags: res2.data.data });
    });
  }, []);

  const logList = (resp.logs) ? 
  <Sider
    theme="light"
    width={300}
    style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
    }}
  >
    <List
      itemLayout="horizontal"
      dataSource={resp.logs.map(log => ({
        name: `${log.first_name} ${log.last_name}`,
        direction: log.direction,
        time: moment(log.time).fromNow(),
      }))}
      style={{ textAlign: 'left' }}
      renderItem={item => (
        <List.Item style={{ padding: 16 }}>
          <List.Item.Meta title={item.name} description={(item.direction === 1 ? 'In: ' : 'Out: ') + item.time} />
        </List.Item>
      )}
    />
  </Sider>
  : <p>Log is empty</p>;

  const tagList = (resp.tags) ?
  <div>
    <Card title="Members">
    {resp.tags.map(tag => (
      <Card.Grid style={{width: '25%', textAlign: 'center'}}>{tag.first_name} {tag.last_name}</Card.Grid>
    ))}
    </Card>
  </div>
    : <p>Tag is empty</p>;
  ;

  return (
    <main className="app">
      <Layout>
        {logList}
        <Layout style={{ marginLeft: 300 }}>
          {/* <Header style={{ background: '#fff', padding: 0 }} /> */}
          <Content style={{ height: '100vh', margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
              {tagList}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    </Layout>,
    </main>
  );
}

export default App;
