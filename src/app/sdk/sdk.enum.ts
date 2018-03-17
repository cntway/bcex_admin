

export enum EnumIsStopType { 
    YES = 1,  // 已停用
    NO = 0,  // 未停用
}

export const EnumIsStopTypeTranslate = { 
    1: '已停用',
    0: '未停用',
}


export enum EnumUserType { 
    SYSTEM = 1,  // 系统管理用户
    PLATFORM = 2,  // 交易所用户
    SETTLE_DEALER = 3,  // 结算会员用户
    SERVICE_DEALER = 4,  // 营运中心用户
    CORE_DEALER = 5,  // 综合会员用户
    BROKER_DEALER = 6,  // 经纪会员用户
    ORG_DEALER = 7,  // 机构用户
    BROKER = 8,  // 经纪人用户
    TRADER = 9,  // 交易用户
}

export const EnumUserTypeTranslate = { 
    1: '系统管理用户',
    2: '交易所用户',
    3: '结算会员用户',
    4: '营运中心用户',
    5: '综合会员用户',
    6: '经纪会员用户',
    7: '机构用户',
    8: '经纪人用户',
    9: '交易用户',
}


export enum EnumAccountType { 
    SETTLE = 1,  // 清算账户（会员/机构/经纪人）
    MANAGER = 2,  // 管理用户
    TRADER = 3,  // 交易用户
}

export const EnumAccountTypeTranslate = { 
    1: '清算账户（会员/机构/经纪人）',
    2: '管理用户',
    3: '交易用户',
}


export enum EnumIdType { 
    IDCARD = 1,  // 身份证
    CREDIT = 2,  // 社会信用代码
    XIANGGANG_IDCARD = 3,  // 香港身份证
    AOMEN_IDCARD = 4,  // 澳门身份证
    TAIWAN_IDCARD = 5,  // 台通身份证
    ORTER = 6,  // 其他
}

export const EnumIdTypeTranslate = { 
    1: '身份证',
    2: '社会信用代码',
    3: '香港身份证',
    4: '澳门身份证',
    5: '台通身份证',
    6: '其他',
}


export enum EnumBindType { 
    LOGINCODE = 0,  // 登录账号
    PHONE = 1,  // 手机号码
    EMAIL = 2,  // 电子邮件
}

export const EnumBindTypeTranslate = { 
    0: '登录账号',
    1: '手机号码',
    2: '电子邮件',
}


export enum EnumResetPwdType { 
    YES = 1,  // 登录提示修改棉麻
    NO = 0,  // 登录不提示修改棉麻
}

export const EnumResetPwdTypeTranslate = { 
    1: '登录提示修改棉麻',
    0: '登录不提示修改棉麻',
}


export enum EnumOptType { 
    YES = 1,  // 启用
    NO = 0,  // 未启用
}

export const EnumOptTypeTranslate = { 
    1: '启用',
    0: '未启用',
}


export enum EnumCreateSourceType { 
    HOUTAI = 0,  // 后台开户
    WECHAT = 1,  // 微信
    PC_WEB = 2,  // PC网页
}

export const EnumCreateSourceTypeTranslate = { 
    0: '后台开户',
    1: '微信',
    2: 'PC网页',
}

