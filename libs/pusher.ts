import Pusher from 'pusher';

// 需要触发 Pusher 事件的表名列表
const ENABLED_TABLES = ['FuxiKuangBiao'];

// 初始化 Pusher 实例
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '2073838',
  key: process.env.PUSHER_KEY || '5b8336697109d43fe95e',
  secret: process.env.PUSHER_SECRET || '1bd98ab0d90e396b45d2',
  cluster: process.env.PUSHER_CLUSTER || 'ap3',
  useTLS: true,
});

/**
 * 检查表名是否在允许列表中
 */
export function shouldTriggerPusher(tableName: string): boolean {
  return ENABLED_TABLES.includes(tableName);
}

/**
 * 触发 Pusher 事件
 * @param tableName 表名（作为 channel）
 * @param eventName 事件名称
 * @param data 要发送的数据
 */
export async function triggerPusherEvent(
  tableName: string,
  eventName: string,
  data: any
): Promise<void> {
  try {
    if (!shouldTriggerPusher(tableName)) {
      console.log(`[Pusher] 表 ${tableName} 不在允许列表中，跳过触发`);
      return;
    }

    await pusher.trigger(tableName, eventName, data);
    console.log(`[Pusher] ✅ 成功触发事件: channel=${tableName}, event=${eventName}`);
  } catch (error) {
    // Pusher 错误不影响主流程，只记录日志
    console.error(`[Pusher] ❌ 触发事件失败:`, error);
  }
}

export default pusher;

