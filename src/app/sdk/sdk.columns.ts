import * as admins_enums from './sdk.admins_enum';
import * as users_enums from './sdk.users_enum';


export const sys_menu_detail_get_columns = [
    { index: 'menuid', text: '菜单id', dataType: 'int' },
    { index: 'menuname', text: '菜单名称', dataType: 'string' },
    { index: 'sortid', text: '显示顺序', dataType: 'int' },
    { index: 'parentid', text: '父菜单id', dataType: 'int' },
    { index: 'parentids', text: '父菜单结构', dataType: 'string' },
    { index: 'isstop', text: '是否停用', dataType: 'enum', enum: admins_enums.EnumIsStopTypeTranslate },
    { index: 'isshow', text: '是否显示', dataType: 'enum', enum: admins_enums.EnumIsStopTypeTranslate },
    { index: 'apikey', text: '接口名称', dataType: 'string' },
    { index: 'pagehref', text: '页面地址', dataType: 'string' },
    { index: 'funckey', text: '用户id', dataType: 'string' },
    { index: 'remark', text: '备忘', dataType: 'string' },
    { index: 'productid', text: '产品id', dataType: 'int' },
];

export const sys_menu_get_columns = [
    { index: 'menuid', text: '菜单id', dataType: 'int' },
    { index: 'menuname', text: '菜单名称', dataType: 'string' },
    { index: 'sortid', text: '显示顺序', dataType: 'int' },
    { index: 'parentid', text: '父菜单id', dataType: 'int' },
    { index: 'parentids', text: '父菜单结构', dataType: 'string' },
];

export const sys_role_get_columns = [
    { index: 'rolename', text: '角色名称', dataType: 'string' },
    { index: 'roletype', text: '角色类型', dataType: 'enum', enum: admins_enums.EnumUserTypeTranslate },
    { index: 'roleid', text: '角色id', dataType: 'int' },
];

export const muser_users_get_columns = [
    { index: 'userid', text: '用户id', dataType: 'int' },
    { index: 'logincode', text: '登陆账号', dataType: 'string' },
    { index: 'userstatus', text: '用户状态', dataType: 'enum', enum: admins_enums.EnumUserStatusTranslate },
    { index: 'username', text: '用户姓名', dataType: 'string' },
    { index: 'nikename', text: '昵称', dataType: 'string' },
    { index: 'phone', text: '手机号码', dataType: 'string' },
    { index: 'email', text: '电子邮件', dataType: 'string' },
    { index: 'idtype', text: '证件类型', dataType: 'enum', enum: admins_enums.EnumIdTypeTranslate },
    { index: 'idcard', text: '证件号', dataType: 'string' },
    { index: 'idcardvaild', text: '证件有效期', dataType: 'date' },
];

export const muser_parames_get_columns = [
    { index: 'paramssection', text: '参数段', dataType: 'string' },
    { index: 'paramsname', text: '参数名称', dataType: 'string' },
    { index: 'paramsvalue', text: '参数值', dataType: 'string' },
];

export const user_users_contact_get_columns = [
    { index: 'userid', text: '用户id', dataType: 'int' },
    { index: 'logincode', text: '登录账号', dataType: 'string' },
    { index: 'username', text: '用户姓名', dataType: 'string' },
    { index: 'nikename', text: '用户昵称', dataType: 'string' },
    { index: 'country', text: '国籍', dataType: 'string' },
    { index: 'telcode', text: '区号', dataType: 'string' },
    { index: 'phone', text: '联系手机', dataType: 'string' },
    { index: 'email', text: '电子邮件', dataType: 'string' },
    { index: 'jsoncache', text: '附属字段', dataType: 'string' },
];

export const user_users_idcard_get_columns = [
    { index: 'userid', text: '用户id', dataType: 'int' },
    { index: 'logincode', text: '登录账号', dataType: 'string' },
    { index: 'username', text: '用户姓名', dataType: 'string' },
    { index: 'nikename', text: '用户昵称', dataType: 'string' },
    { index: 'idtype', text: '证件类型', dataType: 'enum', enum: users_enums.EnumIdTypeTranslate },
    { index: 'idcard', text: '证件号码', dataType: 'string' },
    { index: 'idcardvaild', text: '证件有效期', dataType: 'date' },
    { index: 'jsoncache', text: '附属字段', dataType: 'string' },
];

export const user_users_get_columns = [
    { index: 'userid', text: '用户id', dataType: 'int' },
    { index: 'logincode', text: '登录账号', dataType: 'string' },
    { index: 'useracctype', text: '账号类别', dataType: 'enum', enum: users_enums.EnumUserAccTypeTranslate },
    { index: 'username', text: '用户姓名', dataType: 'string' },
    { index: 'nikename', text: '用户昵称', dataType: 'string' },
    { index: 'createsorce', text: '开户来源', dataType: 'enum', enum: users_enums.EnumCreateSourceTypeTranslate },
    { index: 'lastresetpwdtime', text: '最后修改密码时间', dataType: 'datetime' },
    { index: 'lastcreatetime', text: '开户时间', dataType: 'datetime' },
    { index: 'jsoncache', text: '附属字段', dataType: 'string' },
];

export const user_status_users_get_columns = [
    { index: 'userid', text: '用户id', dataType: 'int' },
    { index: 'logincode', text: '登录账号', dataType: 'string' },
    { index: 'statustype', text: '状态类型', dataType: 'enum', enum: users_enums.EnumUserStatusTypeTranslate },
    { index: 'statusvalue', text: '状态值', dataType: 'string' },
];

export const user_areacode_get_columns = [
    { index: 'telcode', text: '电话区号', dataType: 'string' },
    { index: 'enname', text: '英文名称', dataType: 'string' },
    { index: 'cnname', text: '中文名称', dataType: 'string' },
    { index: 'numcode', text: '国家编码', dataType: 'string' },
];

export const user_parames_get_columns = [
    { index: 'paramssection', text: '参数段', dataType: 'string' },
    { index: 'paramsname', text: '参数名称', dataType: 'string' },
    { index: 'paramsvalue', text: '参数值', dataType: 'string' },
];

