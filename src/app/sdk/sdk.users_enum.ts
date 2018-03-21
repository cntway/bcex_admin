

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


export enum EnumIsEnableType { 
    IST_DISABLE = 0,  // 未生效
    IST_ENABLE = 1,  // 已生效
}

export const EnumIsEnableTypeTranslate = { 
    0: '未生效',
    1: '已生效',
}


export enum EnumIsStopType { 
    IST_NO = 0,  // 未停用
    IST_YES = 1,  // 已停用
}

export const EnumIsStopTypeTranslate = { 
    0: '未停用',
    1: '已停用',
}


export enum EnumIdType { 
    IT_IDCARD = 0,  // 身份证
    IT_CREDIT = 1,  // 社会信用代码
    IT_XIANGGANG_IDCARD = 2,  // 香港身份证
    IT_AOMEN_IDCARD = 3,  // 澳门身份证
    IT_TAIWAN_IDCARD = 4,  // 台通身份证
    IT_ORTER = 5,  // 其他
}

export const EnumIdTypeTranslate = { 
    0: '身份证',
    1: '社会信用代码',
    2: '香港身份证',
    3: '澳门身份证',
    4: '台通身份证',
    5: '其他',
}


export enum EnumBindType { 
    BT_LOGINCODE = 0,  // 登录账号
    BT_PHONE = 1,  // 手机号码
    BT_EMAIL = 2,  // 电子邮件
}

export const EnumBindTypeTranslate = { 
    0: '登录账号',
    1: '手机号码',
    2: '电子邮件',
}


export enum EnumOptType { 
    OT_NO = 0,  // 未启用
    OT_YES = 1,  // 启用
}

export const EnumOptTypeTranslate = { 
    0: '未启用',
    1: '启用',
}


export enum EnumOnlineStatus { 
    OS_OFFLINE = 0,  // 离线
    OS_ONLINE = 1,  // 在线
}

export const EnumOnlineStatusTranslate = { 
    0: '离线',
    1: '在线',
}


export enum EnumOpType { 
    OP_UNKNOW = 1,  // 未知类型
    OP_BIND_EMAIL = 2,  // 绑定电子邮件
    OP_UNBIND_EMAIL = 3,  // 解绑电子邮件
    OP_BIND_PHONE = 4,  // 绑定手机号码
    OP_UNBIND_PHONE = 5,  // 解绑手机号码
    OP_BIND_OTPAUTH = 6,  // 绑定谷歌验证码
    OP_UNBIND_OTPAUTH = 7,  // 解绑谷歌验证码
    OP_LOGIN_PWD_CHENGED = 8,  // 修改登陆密码
    OP_ACCOUNT_PWD_CHENGED = 9,  // 修改资金密码
    OP_LOGIN_PWD_RESET = 10,  // 修改登陆密码
    OP_ACCOUNT_PWD_RESET = 11,  // 重置资金密码
    OP_USER_DATA_COMMIT = 12,  // 提交用户资料
    OP_USER_DATA_REVIEW = 13,  // 审核用户资料
}

export const EnumOpTypeTranslate = { 
    1: '未知类型',
    2: '绑定电子邮件',
    3: '解绑电子邮件',
    4: '绑定手机号码',
    5: '解绑手机号码',
    6: '绑定谷歌验证码',
    7: '解绑谷歌验证码',
    8: '修改登陆密码',
    9: '修改资金密码',
    10: '修改登陆密码',
    11: '重置资金密码',
    12: '提交用户资料',
    13: '审核用户资料',
}


export enum EnumUserStatusType { 
    UST_IS_STATUS = 0,  // 账户状态
    UST_IS_SIGNED = 1,  // 签约状态
    UST_IS_RESET_PASSWORD = 2,  // 登录重置密码状态
    UST_IS_COMMIT = 3,  // 资料提交状态
    UST_IS_REVIEW = 4,  // 资料审核状态
}

export const EnumUserStatusTypeTranslate = { 
    0: '账户状态',
    1: '签约状态',
    2: '登录重置密码状态',
    3: '资料提交状态',
    4: '资料审核状态',
}


export enum EnumUserStatus { 
    US_IS_NORMAL = 0,  // 正常
    US_IS_STOP = 1,  // 停用
    US_IS_READONLY = 2,  // 只读
}

export const EnumUserStatusTranslate = { 
    0: '正常',
    1: '停用',
    2: '只读',
}


export enum EnumSignStatus { 
    SS_IS_UNSIGNED = 0,  // 未签约
    SS_IS_SIGNED = 1,  // 已签约
}

export const EnumSignStatusTranslate = { 
    0: '未签约',
    1: '已签约',
}


export enum EnumResetPwdStatus { 
    RPS_IS_NEED_RESET = 0,  // 需要重置密码
    RPS_IS_NOT_RESET = 1,  // 无需重置密码
}

export const EnumResetPwdStatusTranslate = { 
    0: '需要重置密码',
    1: '无需重置密码',
}


export enum EnumDataCommitStatus { 
    DCS_IS_NOT_COMMIT = 0,  // 未提交资料
    DCS_IS_COMMIT = 1,  // 已提交
}

export const EnumDataCommitStatusTranslate = { 
    0: '未提交资料',
    1: '已提交',
}


export enum EnumCreateSourceType { 
    CST_HOUTAI = 0,  // 后台开户
    CST_WECHAT = 1,  // 微信
    CST_PC_WEB = 2,  // PC网页
}

export const EnumCreateSourceTypeTranslate = { 
    0: '后台开户',
    1: '微信',
    2: 'PC网页',
}


export enum EnumUserAccType { 
    UAT_SETTLE = 0,  // 清算账户
    UAT_NORMAL = 1,  // 普通用户
    UAT_MANAGER = 2,  // 管理员
}

export const EnumUserAccTypeTranslate = { 
    0: '清算账户',
    1: '普通用户',
    2: '管理员',
}


export enum EnumAccIdIncType { 
    AIIT_USERINFO = 0,  // AIIT_USERINFO
}

export const EnumAccIdIncTypeTranslate = { 
    0: 'AIIT_USERINFO',
}

