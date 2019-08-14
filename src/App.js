import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Layout, List } from 'antd';

import './App.css';

const { Sider, Content } = Layout;

function App() {
  const [logs, setLogs] = useState([]);

  const ws = new WebSocket(`ws://${process.env.REACT_APP_ENDPOINT}`);
  ws.onopen = () => {
    // alert('test');
  };

  useEffect(() => {
    if (logs.length < 1) {
      fetch(`http://${process.env.REACT_APP_ENDPOINT}/logs`)
        .then(res => res.json())
        .then(json => {
          setLogs(json.data);
        });
    }
  }, [logs]);

  console.log(logs);

  return (
    <div className="App">
      <Sider
        theme="light"
        width={300}
        style={{
          borderRight: '1px solid #ccc',
          minHeight: '100vh',
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={logs.map(log => ({
            name: `${log.first_name} ${log.last_name}`,
            direction: log.direction,
            time: moment(log.time).fromNow(),
          }))}
          style={{ textAlign: 'left' }}
          renderItem={item => (
            <List.Item style={{ padding: 16 }}>
              <List.Item.Meta
                title={item.name}
                description={
                  item.direction === 1 ? 'In' : 'Out' + ' : ' + item.time
                }
              />
            </List.Item>
          )}
        />
      </Sider>
      <Content>
        <h2>People</h2>
      </Content>
    </div>
  );
}

export default App;
