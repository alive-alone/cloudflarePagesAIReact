import { memo, useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { useSetUrlHash } from '@/utils/common';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCurChatName, setCurChatContext } from '@/store/features/chatData';

import styles from './styles.module.scss';
import backIncon from '@/assets/icon/back.svg';
import editIcon from '@/assets/icon/edit.svg';
import deleteIcon from '@/assets/icon/delete.svg';
import addIcon from '@/assets/icon/add.svg';

interface editFormValueType {
  name: string;
  preset: Array<{ role: string; content: string }>;
}

const Template = () => {
  const editFormRef = useRef(null);
  const { setUrlHash } = useSetUrlHash();
  const chatData = useAppSelector(
    (state) => state.chatData.sessions[state.chatData.currentIndex]
  );
  const dispatch = useAppDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  // 表单初始化数据
  const setEditFormValue = () => {
    console.log('setEditFormValue')
    const value: editFormValueType = {
      name: chatData.mask.name,
      preset: [],
    };
    if (chatData.mask.type !== 'text2img' && chatData.mask?.context?.length) {
      chatData.mask.context.map((item) => {
        if (item.role && item.content) {
          value.preset.push({
            role: item.role,
            content: item.content,
          });
        }
      });
    }
    return value;
  };
  // 修改表单提交
  const submitEdit = (e: editFormValueType) => {
    const context: Array<{ id: string; role: string; content: string }> = [];
    if (e.preset && e.preset.length) {
      e.preset.map((item, index) => {
        if (item.role && item.content) {
          context.push({
            id: `preset-${index}`,
            role: item.role,
            content: item.content,
          });
        }
      });
    }
    dispatch(setCurChatName(e.name));
    dispatch(setCurChatContext(context));
    setShowEditModal(false);
  };
  return (
    <>
      <div className={styles['body']}>
        <div className={styles['block']} onClick={() => setUrlHash('/#/')}>
          <img src={backIncon}></img>
        </div>
        <div className={styles['title-box']}>
          <div
            className={styles['title-cont']}
            onClick={() => {
              setShowEditModal(true);
            }}
          >
            <div className={styles['title']}>{chatData.mask.name}</div>
            <img src={editIcon}></img>
          </div>
          <div
            className={styles['subtitle']}
          >{`共 ${chatData.messages.length} 条聊天`}</div>
        </div>
        <div className={styles['block']}></div>
      </div>
      <Modal
        centered
        open={showEditModal}
        title="编辑基础信息"
        onCancel={() => {
          setShowEditModal(false);
        }}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles['edit-content']}>
          <Form
            ref={editFormRef}
            onFinish={submitEdit}
            layout="vertical"
            initialValues={setEditFormValue()}
            name="edit"
          >
            <Form.Item
              label="聊天名称"
              name="name"
              rules={[{ required: true, message: '聊天名称不能为空' }]}
            >
              <Input placeholder="" />
            </Form.Item>
            {chatData.mask.type !== 'text2img' ? (
              <Form.Item label="预设数据">
                <Form.List name="preset" rules={[]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <div className={styles['preset-box']}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'role']}
                            noStyle
                          >
                            <Select
                              // defaultValue="system"
                              style={{ width: 100 }}
                              options={[
                                { value: 'system', label: 'system' },
                                { value: 'user', label: 'user' },
                                { value: 'assistant', label: 'assistant' },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'content']}
                            noStyle
                          >
                            <Input
                              placeholder="扮演角色"
                              style={{ width: '60%', flex: 1 }}
                            />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <img
                              src={deleteIcon}
                              className={styles['delete-btn']}
                              onClick={() => remove(field.name)}
                            ></img>
                          ) : null}
                        </div>
                      ))}
                      <div
                        className={styles['add-btn']}
                        onClick={() => {
                          add({ role: 'system' });
                        }}
                      >
                        <img src={addIcon}></img>
                      </div>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            ) : null}

            <div className={styles['submit-btn']}>
              <Button type="primary" htmlType="submit" style={{ marginTop: 0 }}>
                保存
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(Template);
