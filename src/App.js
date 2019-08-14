import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Avatar, Badge, Layout, List, Icon, Typography } from 'antd';

import './App.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

function ProfileCard({ title, avatar, isPresent }) {
  return (
    <div
      style={{
        width: '100%',
        background: '#fff',
        textAlign: 'center',
        borderWidth: 5,
        borderColor: isPresent ? '#20B7BE' : '#fff',
        borderStyle: 'solid',
        boxShadow: isPresent
          ? '0 8px 24px rgba(0,0,0,0.3)'
          : '0 2px 10px rgba(0,0,0,0.001)',
        padding: 16,
        borderRadius: 16,
        transition: 'all 0.2s',
      }}
    >
      {avatar}
      <h3 style={{ marginTop: 8 }}>{title}</h3>
      <Icon
        theme="twoTone"
        type={isPresent ? 'check-circle' : 'close-circle'}
        twoToneColor={isPresent ? '#20B7BE' : '#ccc'}
        style={{
          fontSize: 48,
        }}
      />
    </div>
  );
}

function App() {
  const [logs, setLogs] = useState(null);
  const [tags, setTags] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load in the logs
  const loadLogs = () => {
    fetch(`http://${process.env.REACT_APP_ENDPOINT}/logs`)
      .then(res => res.json())
      .then(json => {
        setLogs(json.data);
      });
  };

  // Load in the tags
  const loadTags = () => {
    fetch(`http://${process.env.REACT_APP_ENDPOINT}/tags`)
      .then(res => res.json())
      .then(json => {
        setTags(json.data);
      });
  };

  // Connection status
  useEffect(() => {
    const ws = new WebSocket(`ws://${process.env.REACT_APP_ENDPOINT}`);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.event === 'logged') {
        const tag = msg.data;

        // TODO - check for tag in tags and set status

        loadLogs();
      }
    };
  }, []);

  // Load in initial data via AJAX
  useEffect(() => {
    if (logs === null) {
      loadLogs();
    }
    if (tags === null) {
      loadTags();
    }
  }, [logs, tags]);

  return (
    <div className="App">
      <Content style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            width: '100%',
            backgroundColor: '#fff',
            borderBottom: '5px solid #e9312f',
            fontWeight: 600,
            color: '#000',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width={30}
              viewBox="0 0 800 800"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              strokeLineJoin="round"
              strokeMiterlimit="2"
            >
              <path fill="#e9312f" d="M-1.023-4.094H806.36V803.29H-1.023z" />
              <path
                d="M379.783 579.016h-72.516v114.156h-132.37V106.76h204.886v472.256zM414.798 106.76h107.86v472.255h-107.86zM561.85 179.552h65.12v326.671h-65.12z"
                fill="#fff"
              />
            </svg>
            <span style={{ paddingLeft: 8 }}>Propeller:Exmouth</span>
          </div>
          {isConnected ? (
            <Badge status="success" text="Connected" />
          ) : (
            <Badge status="default" text="Not connected" />
          )}
          <span style={{ paddingLeft: 24 }}>
            {moment().format('MMMM Do YYYY')}
          </span>
        </div>

        <Content
          style={{
            padding: 16,
            flex: 1,
            height: '100%',
          }}
        >
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            itemLayout="horizontal"
            loading={
              tags === null && {
                indicator: <Icon type="sync" style={{ fontSize: 24 }} spin />,
              }
            }
            dataSource={
              tags === null
                ? []
                : tags.map(tag => ({
                    name: `${tag.first_name} ${tag.last_name}`,
                    isPresent: tag.present_status === 1,
                  }))
            }
            renderItem={item => (
              <List.Item style={{ padding: 16 }}>
                <ProfileCard
                  title={item.name}
                  isPresent={item.isPresent}
                  avatar={
                    <Avatar
                      size={48}
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                  }
                />
              </List.Item>
            )}
          />
        </Content>
      </Content>
      <Sider
        theme="light"
        width={360}
        style={{
          borderLeft: '1px solid #e9312f',
          minHeight: '100vh',
          background: '#e9312f',
          padding: 16,
        }}
      >
        {logs === null && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}
          >
            <Icon type="sync" style={{ fontSize: 16, color: '#fff' }} spin />
          </div>
        )}

        {logs !== null &&
          logs.map(log => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 8,
                  borderBottom: '1px solid #8B2430',
                  color: '#fff',
                }}
              >
                <Icon type={log.direction === 1 ? 'login' : 'logout'} />
                <Text style={{ color: '#fff', marginLeft: 8 }}>{`${
                  log.first_name
                } ${log.last_name} signed ${
                  log.direction === 1 ? 'in' : 'out'
                } ${moment(log.time).fromNow()}`}</Text>
              </div>
            );
          })}
      </Sider>
    </div>
  );
}

export default App;
