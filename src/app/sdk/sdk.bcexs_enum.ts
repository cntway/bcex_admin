

export enum EYesNoType { 
    YN_NO = 0,  // YN_No
    YN_YES = 1,  // YN_Yes
}

export const EYesNoTypeTranslate = { 
    0: 'YN_No',
    1: 'YN_Yes',
}


export enum EBoolType { 
    BOOL_FALSE = 0,  // BOOL_False
    BOOL_TRUE = 1,  // BOOL_True
}

export const EBoolTypeTranslate = { 
    0: 'BOOL_False',
    1: 'BOOL_True',
}


export enum YesNoEnum { 
    NONE = 0,  // None
    YES = 1,  // yes
    NO = 2,  // no
}

export const YesNoEnumTranslate = { 
    0: 'None',
    1: 'yes',
    2: 'no',
}


export enum WeekEnum { 
    NONE = 0,  // None
    MONDAY = 1,  // 周一
    TUESDAY = 2,  // 周二
    WEDNESDAY = 3,  // 周三
    THURSDAY = 4,  // 周四
    FIRDAY = 5,  // 周五
    SATURDAY = 6,  // 周六
    SUNDAY = 7,  // 周日
}

export const WeekEnumTranslate = { 
    0: 'None',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日',
}


export enum SettlementStatusEnum { 
    NONE = 0,  // None
    DOING = 1,  // 结算中
    DONE = 2,  // 结算完成
    FAIL = 3,  // 结算失败
}

export const SettlementStatusEnumTranslate = { 
    0: 'None',
    1: '结算中',
    2: '结算完成',
    3: '结算失败',
}


export enum DataSyncStatusEnum { 
    NONE = 0,  // None
    UNSYNC = 1,  // 未同步
    SYNCING = 2,  // 同步中，完成日切准备数据
    SYNCED = 3,  // 已同步
    SYNCPREPARE = 4,  // 日切准备数据中
}

export const DataSyncStatusEnumTranslate = { 
    0: 'None',
    1: '未同步',
    2: '同步中，完成日切准备数据',
    3: '已同步',
    4: '日切准备数据中',
}


export enum RiskNotifyEnum { 
    NONE = 0,  // None
    NORMAL = 1,  // 正常
    WARNING = 2,  // 警告
    FORCECLOSE = 3,  // 强平
    LIMIT = 4,  // 受限
    FREEZE = 5,  // 冻结
}

export const RiskNotifyEnumTranslate = { 
    0: 'None',
    1: '正常',
    2: '警告',
    3: '强平',
    4: '受限',
    5: '冻结',
}


export enum PasswordEnum { 
    NONE = 0,  // None
    LOGINPWD = 1,  // 登录密码
    MONEYPWD = 2,  // 资金密码
    PHONEPWD = 3,  // 电话密码
}

export const PasswordEnumTranslate = { 
    0: 'None',
    1: '登录密码',
    2: '资金密码',
    3: '电话密码',
}


export enum AccMsTypeEnum { 
    NONE = 0,  // None
    MASTER = 1,  // 主帐
    SLAVE = 2,  // 子帐
}

export const AccMsTypeEnumTranslate = { 
    0: 'None',
    1: '主帐',
    2: '子帐',
}


export enum AccSTEnum { 
    NONE = 0,  // None
    NORMAL = 1,  // 正常
    FROZEN = 2,  // 冻结
    DEAD = 3,  // 注销
}

export const AccSTEnumTranslate = { 
    0: 'None',
    1: '正常',
    2: '冻结',
    3: '注销',
}


export enum AccTypeEnum { 
    NONE = 0,  // None
    EXCH = 1,  // 交易所
    USER = 2,  // 投资者
}

export const AccTypeEnumTranslate = { 
    0: 'None',
    1: '交易所',
    2: '投资者',
}


export enum BonusEnum { 
    NONE = 0,  // None
    LOGIN = 1,  // 登陆
    REFILL = 2,  // 充值
}

export const BonusEnumTranslate = { 
    0: 'None',
    1: '登陆',
    2: '充值',
}


export enum BindingLoginEnum { 
    NONE = 0,  // None
    LOGINCODE = 1,  // 登陆账号
    PHONE = 2,  // 手机
    EMAIL = 3,  // 邮箱
}

export const BindingLoginEnumTranslate = { 
    0: 'None',
    1: '登陆账号',
    2: '手机',
    3: '邮箱',
}


export enum UseEnum { 
    NONE = 0,  // None
    NORMAL = 1,  // 可用
    REVOKE = 2,  // 废弃
    EXPIRE = 3,  // 过期
}

export const UseEnumTranslate = { 
    0: 'None',
    1: '可用',
    2: '废弃',
    3: '过期',
}


export enum VipEnum { 
    C0 = 0,  // C0
    C1 = 1,  // C1
    C2 = 2,  // C2
    C3 = 3,  // C3
    C4 = 4,  // C4
    C5 = 5,  // C5
}

export const VipEnumTranslate = { 
    0: 'C0',
    1: 'C1',
    2: 'C2',
    3: 'C3',
    4: 'C4',
    5: 'C5',
}


export enum MarketModeEnum { 
    NONE = 0,  // None
    SPOT = 1,  // 现货交易模式
    MARGIN = 2,  // 保证金交易模式
}

export const MarketModeEnumTranslate = { 
    0: 'None',
    1: '现货交易模式',
    2: '保证金交易模式',
}


export enum MarketStatusEnum { 
    NONE = 0,  // None
    OPEN = 1,  // 开市
    BREAK = 2,  // 休市
    SHUTDOWN = 3,  // 关闭
}

export const MarketStatusEnumTranslate = { 
    0: 'None',
    1: '开市',
    2: '休市',
    3: '关闭',
}


export enum IOStatusEnum { 
    NONE = 0,  // None
    NORMAL = 1,  // 正常
    PAUSE = 2,  // 暂停
}

export const IOStatusEnumTranslate = { 
    0: 'None',
    1: '正常',
    2: '暂停',
}


export enum PairStatusEnum { 
    NONE = 0,  // None
    NORMAL = 1,  // 正常交易
    PAUSE = 2,  // 暂停交易
    OFFSALE = 3,  // 下架
    WAITTING = 4,  // 等待上市
}

export const PairStatusEnumTranslate = { 
    0: 'None',
    1: '正常交易',
    2: '暂停交易',
    3: '下架',
    4: '等待上市',
}


export enum BsCodeEnum { 
    NONE = 0,  // None
    BUY = 1,  // 买
    SELL = 2,  // 卖
}

export const BsCodeEnumTranslate = { 
    0: 'None',
    1: '买',
    2: '卖',
}


export enum OrderTypeEnum { 
    NONE = 0,  // None
    MARKET = 1,  // 市价单
    LIMIT = 2,  // 限价单
}

export const OrderTypeEnumTranslate = { 
    0: 'None',
    1: '市价单',
    2: '限价单',
}


export enum OrderStatusEnum { 
    WAITING = 1,  // 等待成交
    PARTDONE = 2,  // 部分成交
    DONE = 3,  // 完全成交
    CANCEL = 4,  // 撤销
}

export const OrderStatusEnumTranslate = { 
    1: '等待成交',
    2: '部分成交',
    3: '完全成交',
    4: '撤销',
}


export enum OrderOpEnum { 
    NONE = 0,  // None
    ORDER = 1,  // 委托
    DONE = 2,  // 成交
    CANCEL = 3,  // 撤销
}

export const OrderOpEnumTranslate = { 
    0: 'None',
    1: '委托',
    2: '成交',
    3: '撤销',
}


export enum IOTypeEnum { 
    NONE = 0,  // None
    REFILL = 1,  // 充值
    WITHDRAW = 2,  // 提现
}

export const IOTypeEnumTranslate = { 
    0: 'None',
    1: '充值',
    2: '提现',
}


export enum IORSEnum { 
    NONE = 0,  // None
    WAUDIT = 1,  // 等待审核
    SENDING = 2,  // 打币中
    DONE = 3,  // 完成
    REJECT = 4,  // 拒绝
    WCONFIRM = 5,  // 等待确认
}

export const IORSEnumTranslate = { 
    0: 'None',
    1: '等待审核',
    2: '打币中',
    3: '完成',
    4: '拒绝',
    5: '等待确认',
}


export enum UMTypeEnum { 
    NONE = 0,  // None
    REFILL = 1,  // 充值
    WITHDRAW = 2,  // 提现
    TRADEPAY = 3,  // 交易支出
    TRADEGAIN = 4,  // 交易获得
    FEEPAY = 5,  // 支出手续费
    FEEGAIN = 6,  // 得到手续费
}

export const UMTypeEnumTranslate = { 
    0: 'None',
    1: '充值',
    2: '提现',
    3: '交易支出',
    4: '交易获得',
    5: '支出手续费',
    6: '得到手续费',
}


export enum RealNameVEnum { 
    NONE = 0,  // None
    V1 = 1,  // 初级认证，注册有手机号
    V2 = 2,  // 中级认证，姓名身份证号码
    V3 = 3,  // 高级认证，3张身份证图片
}

export const RealNameVEnumTranslate = { 
    0: 'None',
    1: '初级认证，注册有手机号',
    2: '中级认证，姓名身份证号码',
    3: '高级认证，3张身份证图片',
}


export enum RiskEnum { 
    NONE = 0,  // None
    MN = 1,  // 占用/净值
    NM = 2,  // 净值/占用
}

export const RiskEnumTranslate = { 
    0: 'None',
    1: '占用/净值',
    2: '净值/占用',
}


export enum SettlementEnum { 
    NONE = 0,  // None
    NEVERINDEBTED = 1,  // 无负债结算
    INDEBTED = 2,  // 有负债结算
}

export const SettlementEnumTranslate = { 
    0: 'None',
    1: '无负债结算',
    2: '有负债结算',
}


export enum TradeStatusEnum { 
    NONE = 0,  // None
    OPEN = 1,  // 开市
    CLOSE = 2,  // 休市
    STOP = 3,  // 收市
    SETTLE = 4,  // 结算
    SETTLEEND = 5,  // 结算结束
    WAITOPEN = 6,  // 等待开市
}

export const TradeStatusEnumTranslate = { 
    0: 'None',
    1: '开市',
    2: '休市',
    3: '收市',
    4: '结算',
    5: '结算结束',
    6: '等待开市',
}


export enum OperatorEnum { 
    NONE = 0,  // None
    AUTO = 1,  // 自动
    MANUAL = 2,  // 手工
}

export const OperatorEnumTranslate = { 
    0: 'None',
    1: '自动',
    2: '手工',
}


export enum OnlineStatusEnum { 
    NONE = 0,  // None
    ONLINE = 1,  // 在线
    OFFLINE = 2,  // 离线
}

export const OnlineStatusEnumTranslate = { 
    0: 'None',
    1: '在线',
    2: '离线',
}

