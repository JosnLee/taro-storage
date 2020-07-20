# 扩展Taro 的前端本地存储


## 安装

npm i taro-storage

## 使用
```bash
import storage from 'taro-storage'

### 获取会话内存储的值
storage.getSessionStorage(key)

### 写入会话内缓存
storage.setSessionStorage(key, value)

### 移除会话内的单个存储
storage.removeSessionStorage(key)

###本地永久存储,写入有效期，有效期内会取出来，失效后会清空
storage.setLocalStorage(key, value, exp)

###本地取出存储的值
storage.getLocalStorage(key)

###本地删除存储
storage.removeLocalStorage(key)

###移除本地所有的过期的缓存
storage.removeAllLocalExp()

```