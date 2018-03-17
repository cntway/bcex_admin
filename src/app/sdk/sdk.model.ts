import * as admins_enums from './sdk.admins_enum';
import * as users_enums from './sdk.users_enum';
import { FeildCheckError } from './sdk.util';
import { isDate } from 'util';

export function _(val: string): string {
    return val;
}

export const UINT_LIAT = ['uint16'];
export const FLOAT_LIST = ['double8_4', 'double16_6', 'double16_2', 'double24_8'];
export const STRING_LIST = ['string4', 'string8', 'string12', 'string16', 'string24', 'string32', 'string64', 'string512', 'jsonString', 'string'];
export const BYTE_LIST = ['byte24'];

export abstract class FeildCheck {

    public abstract fields_options: any;
    public abstract field_keys: string[];

    public static check_field_int(options: {}, key: string, val: number): void {
        const minval = parseInt(options['minval'], 10);
        const maxval = parseInt(options['maxval'], 10);

        if (!isNaN(minval) && val < minval) {
            throw (new FeildCheckError(_(`超出字段最小值[${key}][min=${minval}]`)));
        }

        if (!isNaN(maxval) && val < maxval) {
            throw (new FeildCheckError(_(`超出字段最大值[${key}][max=${maxval}]`)));
        }
    }

    public static check_field_float(options: {}, key: string, val: number): void {
        const minval = parseFloat(options['minval']);
        const maxval = parseFloat(options['maxval']);

        if (!isNaN(minval) && val < minval) {
            throw (new FeildCheckError(_(`超出字段最小值[${key}][min=${minval}]`)));
        }

        if (!isNaN(maxval) && val > maxval) {
            throw (new FeildCheckError(_(`超出字段最大值[${key}][max=${maxval}]`)));
        }
    }

    public static check_field_string(options: {}, key: string, val: string): void {
        const minlen = parseInt(options['minlen'], 10);
        const maxlen = parseInt(options['maxlen'], 10);

        if (!isNaN(minlen) && val.length < minlen) {
            throw (new FeildCheckError(_(`超出字段最小长度[${key}][min=${minlen}]`)));
        }

        if (!isNaN(maxlen) && val.length > maxlen) {
            throw (new FeildCheckError(_(`超出字段最大长度[${key}][max=${maxlen}]`)));
        }
    }

    public static check_field_bytes(options: {}, key: string, val: string): void {
        const minlen = parseInt(options['minlen'], 10);
        const maxlen = parseInt(options['maxlen'], 10);

        if (!isNaN(minlen) && val.length < minlen) {
            throw (new FeildCheckError(_(`超出字段最大长度[${key}][max=${maxlen}]`)));
        }

        if (!isNaN(maxlen) && val.length > maxlen) {
            throw (new FeildCheckError(_(`超出字段最大长度[${key}][max=${maxlen}]`)));
        }
    }

    public static check_field_datetime(options: {}, key: string, val: string): void {
        const regix = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}[ T][0-9]{2}:[0-9]{2}:[0-9]{2}$', 'g');
        if (!val.match(regix)) {
            throw (new FeildCheckError(_(`无效时间格式[${key}][YYYY-mm-DD HH:MM:SS]`)));
        }
    }

    public static check_field_date(options: {}, key: string, val: string): void {
        if (isDate(val)) {
            return
        }
        const regix = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$', 'g');
        if (!val.match(regix)) {
            throw (new FeildCheckError(_(`无效时间格式[${key}][YYYY-mm-DD HH:MM:SS]`)));
        }
    }

    public static check_field_enum(enum_name: string, key: string, val: string): void {
        let class_obj = null;
        try {
            // 存在同名枚举冲突
            class_obj = users_enums[enum_name];
        } catch (error) {
            throw (new FeildCheckError(_(`无效枚举名称[${enum_name}]`)));
        }

        if (class_obj === undefined) {
            try {
                class_obj = admins_enums[enum_name];
            } catch (error) {
                throw (new FeildCheckError(_(`无效枚举名称[${enum_name}]`)));
            }
        }

        const vals = Object.keys(class_obj).map(k => class_obj[k]);
        if (!(val in vals)) {
            throw (new FeildCheckError(_(`无效枚举值[${enum_name}][${key}][${val}]`)));
        }
    }

    public static check_field_int_list(options: {}, key: string, val: number[]): void {

    }

    public do_fields_check(): void {
        const fields_options = this.fields_options;
        const _this = this;
        Object.keys(fields_options).forEach(function (key) {
            const val = _this[key];
            const options = fields_options[key];
            if (val === undefined) {
                throw (new FeildCheckError(_(`options_error[${key}]`)));
            }
            if (STRING_LIST.indexOf(options['type']) > -1) {
                FeildCheck.check_field_string(options, key, val);
            } else if (options['type'] === 'bytes' || BYTE_LIST.indexOf(options['type']) > -1) {
                FeildCheck.check_field_bytes(options, key, val);
            } else if (options['type'] === 'int32' || options['type'] === 'int64' || UINT_LIAT.indexOf(options['type']) > -1) {
                FeildCheck.check_field_int(options, key, val);
            } else if (options['type'] === 'float' || options['type'] === 'double' || FLOAT_LIST.indexOf(options['type']) > -1) {
                FeildCheck.check_field_float(options, key, val);
            } else if (options['type'] === 'datetime') {
                FeildCheck.check_field_datetime(options, key, val);
            } else if (options['type'] === 'date') {
                FeildCheck.check_field_date(options, key, val);
            } else if (options['type'] === 'list_int32') {
                FeildCheck.check_field_int_list(options, key, val);
            } else if (options['type'].length > 4 && options['type'].slice(0, 4) === 'Enum') {
                FeildCheck.check_field_enum(options['type'], key, val);
            } else {
                throw (new FeildCheckError(_(`枚举名称定义格式不符[${JSON.stringify(options)}]`)));
            }
        });
    }


    public field2dict(): {} {
        const _this = this;
        const result = {};
        this.field_keys.forEach(function (key) {
            result[key] = _this[key];
        });
        return result;
    }

    public is_fields_vaild(): boolean {
        const _this = this;
        try {
            _this.fields_check();
            return true;
        } catch (error) {
            return false;
        }
    }

    public fields_check(): void {
        this.do_fields_check();
    }

}



export class UserHeartbeatPost extends FeildCheck {


    public fields_options = {
    };

    public field_keys: string[] = [

    ];
}


export class UserLoginPost extends FeildCheck {


    public logincode: string;  // 登录账号

    public password: string;  // 登录密码

    public clientver: string;  // 客户端版本

    public fields_options = {
        'logincode': {
            'maxlen': '32',
            'minlen': '6',
            'maxval': 'none',
            'minval': 'none',
            'type': 'string'
        },
        'password': {
            'maxlen': '32',
            'minlen': '6',
            'maxval': 'none',
            'minval': 'none',
            'type': 'string'
        },
        'clientver': {
            'maxlen': '16',
            'minlen': '6',
            'maxval': 'none',
            'minval': 'none',
            'type': 'string'
        },
    };

    public field_keys: string[] = [
        'logincode',
        'password',
        'clientver'
    ];
}


export class SysMenuDelete extends FeildCheck {


    public menuid: number;  // 菜单id

    public fields_options = {
        'menuid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'menuid'
    ];
}


export class SysMenuDetailGet extends FeildCheck {


    public menuid: number;  // 菜单id

    public fields_options = {
        'menuid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'menuid'
    ];
}


export class SysMenuGet extends FeildCheck {


    public menuid: number;  // 菜单id

    public fields_options = {
        'menuid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'menuid'
    ];
}


export class SysMenuPost extends FeildCheck {


    public sortid: number;  // 显示顺序

    public productid: number;  // 产品id

    public pagehref: string;  // 页面地址

    public apikey: string;  // 接口名称

    public parentid: number;  // 父菜单id

    public isshow: admins_enums.EnumIsStopType;  // 是否显示

    public funckey: string;  // 前端用配置字段

    public menuname: string;  // 菜单名称

    public isstop: admins_enums.EnumIsStopType;  // 是否停用

    public remark: string;  // 备忘

    public commituri: string;  // 提交接口地址

    public fields_options = {
        'sortid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'productid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'pagehref': {
            'maxlen': '32',
            'type': 'string32'
        },
        'apikey': {
            'maxlen': '32',
            'type': 'string32'
        },
        'parentid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'isshow': {
            'maxlen': 'none',
            'type': 'EnumIsStopType'
        },
        'funckey': {
            'maxlen': '32',
            'type': 'string32'
        },
        'menuname': {
            'maxlen': '32',
            'type': 'string32'
        },
        'isstop': {
            'maxlen': 'none',
            'type': 'EnumIsStopType'
        },
        'remark': {
            'maxlen': '32',
            'type': 'string32'
        },
        'commituri': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'sortid',
        'productid',
        'pagehref',
        'apikey',
        'parentid',
        'isshow',
        'funckey',
        'menuname',
        'isstop',
        'remark',
        'commituri'
    ];
}


export class SysMenuPut extends FeildCheck {


    public sortid: number;  // 显示顺序

    public menuid: number;  // 菜单id

    public productid: number;  // 产品id

    public parentids: string;  // 父菜单结构

    public pagehref: string;  // 页面地址

    public apikey: string;  // 接口名称

    public parentid: number;  // 父菜单id

    public isshow: admins_enums.EnumIsStopType;  // 是否显示

    public funckey: string;  // 前端用配置字段

    public menuname: string;  // 菜单名称

    public isstop: admins_enums.EnumIsStopType;  // 是否停用

    public remark: string;  // 备忘

    public commituri: string;  // 提交接口地址

    public fields_options = {
        'sortid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'menuid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'productid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'parentids': {
            'maxlen': '32',
            'type': 'string32'
        },
        'pagehref': {
            'maxlen': '32',
            'type': 'string32'
        },
        'apikey': {
            'maxlen': '32',
            'type': 'string32'
        },
        'parentid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'isshow': {
            'maxlen': 'none',
            'type': 'EnumIsStopType'
        },
        'funckey': {
            'maxlen': '32',
            'type': 'string32'
        },
        'menuname': {
            'maxlen': '32',
            'type': 'string32'
        },
        'isstop': {
            'maxlen': 'none',
            'type': 'EnumIsStopType'
        },
        'remark': {
            'maxlen': '32',
            'type': 'string32'
        },
        'commituri': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'sortid',
        'menuid',
        'productid',
        'parentids',
        'pagehref',
        'apikey',
        'parentid',
        'isshow',
        'funckey',
        'menuname',
        'isstop',
        'remark',
        'commituri'
    ];
}


export class SysRoleDelete extends FeildCheck {


    public roleid: number;  // 角色id

    public fields_options = {
        'roleid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'roleid'
    ];
}


export class SysRoleGet extends FeildCheck {


    public roleid: number;  // 角色id

    public fields_options = {
        'roleid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'roleid'
    ];
}


export class SysRolePost extends FeildCheck {


    public rolename: string;  // 角色名称

    public roletype: admins_enums.EnumUserType;  // 角色类型

    public fields_options = {
        'rolename': {
            'maxlen': '32',
            'type': 'string32'
        },
        'roletype': {
            'maxlen': 'none',
            'type': 'EnumUserType'
        },
    };

    public field_keys: string[] = [
        'rolename',
        'roletype'
    ];
}


export class SysRoleMenuPut extends FeildCheck {


    public roleid: number;  // 角色id

    public menuids: number[];  // 菜单id列表

    public fields_options = {
        'roleid': {
            'maxlen': 'none',
            'minlen': 'none',
            'maxval': 'none',
            'minval': 'none',
            'type': 'int32'
        },
        'menuids': {
            'maxlen': 'none',
            'minlen': 'none',
            'maxval': 'none',
            'minval': 'none',
            'type': 'list_int32'
        },
    };

    public field_keys: string[] = [
        'roleid',
        'menuids'
    ];
}


export class SysRolePut extends FeildCheck {


    public roleid: number;  // 角色id

    public rolename: string;  // 角色名称

    public fields_options = {
        'roleid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'rolename': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'roleid',
        'rolename'
    ];
}


export class MuserUsersDelete extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class MuserUsersGet extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class MuserUsersPost extends FeildCheck {


    public nikename: string;  // 用户昵称

    public userpwd: string;  // 用户密码

    public username: string;  // 用户姓名

    public email: string;  // 电子邮箱

    public userstatus: admins_enums.EnumUserStatus;  // 用户状态

    public phone: string;  // 手机号码

    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public logincode: string;  // 登录账号

    public idtype: admins_enums.EnumIdType;  // 证件类型

    public fields_options = {
        'nikename': {
            'maxlen': '32',
            'type': 'string32'
        },
        'userpwd': {
            'maxlen': '24',
            'type': 'byte24'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32'
        },
        'userstatus': {
            'maxlen': 'none',
            'type': 'EnumUserStatus'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date'
        },
        'logincode': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType'
        },
    };

    public field_keys: string[] = [
        'nikename',
        'userpwd',
        'username',
        'email',
        'userstatus',
        'phone',
        'idcard',
        'idcardvaild',
        'logincode',
        'idtype'
    ];
}


export class MuserUsersPut extends FeildCheck {


    public phone: string;  // 手机号码

    public idcard: string;  // 证件号码

    public nikename: string;  // 用户昵称

    public idcardvaild: string;  // 证件有效期

    public username: string;  // 用户姓名

    public userid: number;  // 用户id

    public idtype: admins_enums.EnumIdType;  // 证件类型

    public email: string;  // 电子邮箱

    public fields_options = {
        'phone': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'phone',
        'idcard',
        'nikename',
        'idcardvaild',
        'username',
        'userid',
        'idtype',
        'email'
    ];
}


export class MuserParamesDelete extends FeildCheck {


    public paramsname: string;  // 配置名称

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16'
        },
    };

    public field_keys: string[] = [
        'paramsname'
    ];
}


export class MuserParamesGet extends FeildCheck {


    public userid: number;  // 用户id

    public paramsname: string;  // 配置名称

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'paramsname': {
            'maxlen': '16',
            'type': 'string16'
        },
    };

    public field_keys: string[] = [
        'userid',
        'paramsname'
    ];
}


export class MuserParamesPut extends FeildCheck {


    public paramssection: string;  // 配置段

    public paramsname: string;  // 配置名称

    public paramsvalue: string;  // 配置值

    public fields_options = {
        'paramssection': {
            'maxlen': '16',
            'type': 'string16'
        },
        'paramsname': {
            'maxlen': '16',
            'type': 'string16'
        },
        'paramsvalue': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'paramssection',
        'paramsname',
        'paramsvalue'
    ];
}


export class UserUsersContactGet extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class UserUsersIdcardGet extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class UserUsersGet extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class UserStatusUsersGet extends FeildCheck {


    public userid: number;  // 用户id

    public statustype: users_enums.EnumUserStatusType;  // 状态类型

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'statustype': {
            'maxlen': 'none',
            'type': 'EnumUserStatusType'
        },
    };

    public field_keys: string[] = [
        'userid',
        'statustype'
    ];
}


export class UserUsersPost extends FeildCheck {


    public jsoncache: string;  // 附加字段

    public nikename: string;  // 用户昵称

    public userpwd: string;  // 用户密码

    public username: string;  // 用户姓名

    public email: string;  // 电子邮箱

    public country: string;  // 国籍

    public phone: string;  // 手机号码

    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public logincode: string;  // 登录账号

    public idtype: users_enums.EnumIdType;  // 证件类型

    public telcode: string;  // 电话区号

    public fields_options = {
        'jsoncache': {
            'maxlen': '512',
            'type': 'jsonString'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32'
        },
        'userpwd': {
            'maxlen': '64',
            'type': 'string64'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date'
        },
        'logincode': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType'
        },
        'telcode': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'jsoncache',
        'nikename',
        'userpwd',
        'username',
        'email',
        'country',
        'phone',
        'idcard',
        'idcardvaild',
        'logincode',
        'idtype',
        'telcode'
    ];
}


export class UserUsersContactPut extends FeildCheck {


    public email: string;  // 电子邮箱

    public userid: number;  // 用户id

    public phone: string;  // 手机号码

    public country: string;  // 国籍

    public telcode: string;  // 电话区号

    public fields_options = {
        'email': {
            'maxlen': '32',
            'type': 'string32'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32'
        },
        'telcode': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'email',
        'userid',
        'phone',
        'country',
        'telcode'
    ];
}


export class UserUsersIdcardPut extends FeildCheck {


    public userid: number;  // 用户id

    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public idtype: users_enums.EnumIdType;  // 证件类型

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType'
        },
    };

    public field_keys: string[] = [
        'userid',
        'idcard',
        'idcardvaild',
        'idtype'
    ];
}


export class UserUsersPut extends FeildCheck {


    public username: string;  // 用户姓名

    public jsoncache: string;  // 附加字段

    public nikename: string;  // 用户昵称

    public userid: number;  // 用户id

    public fields_options = {
        'username': {
            'maxlen': '32',
            'type': 'string32'
        },
        'jsoncache': {
            'maxlen': '512',
            'type': 'jsonString'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
    };

    public field_keys: string[] = [
        'username',
        'jsoncache',
        'nikename',
        'userid'
    ];
}


export class UserStatusUsersPut extends FeildCheck {


    public userid: number;  // 用户id

    public statusvalue: string;  // 状态值

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'statusvalue': {
            'maxlen': '16',
            'type': 'string16'
        },
    };

    public field_keys: string[] = [
        'userid',
        'statusvalue'
    ];
}


export class UserAreacodeDelete extends FeildCheck {


    public numcode: string;  // 数字编码

    public fields_options = {
        'numcode': {
            'maxlen': '8',
            'type': 'string8'
        },
    };

    public field_keys: string[] = [
        'numcode'
    ];
}


export class UserAreacodeGet extends FeildCheck {


    public numcode: string;  // 数字编码

    public fields_options = {
        'numcode': {
            'maxlen': '8',
            'type': 'string8'
        },
    };

    public field_keys: string[] = [
        'numcode'
    ];
}


export class UserAreacodePost extends FeildCheck {


    public threecode: string;  // 三位编码

    public numcode: string;  // 数字编码

    public areadesc: string;  // 备注信息

    public cnname: string;  // 中文名称

    public twocode: string;  // 二位编码

    public telcode: string;  // 手机区号

    public enname: string;  // 英文名称

    public fields_options = {
        'threecode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'numcode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'areadesc': {
            'maxlen': '32',
            'type': 'string32'
        },
        'cnname': {
            'maxlen': '32',
            'type': 'string32'
        },
        'twocode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'telcode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'enname': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'threecode',
        'numcode',
        'areadesc',
        'cnname',
        'twocode',
        'telcode',
        'enname'
    ];
}


export class UserAreacodePut extends FeildCheck {


    public threecode: string;  // 三位编码

    public enname: string;  // 英文名称

    public numcode: string;  // 数字编码

    public twocode: string;  // 二位编码

    public telcode: string;  // 手机区号

    public areadesc: string;  // 备注信息

    public cnname: string;  // 中文名称

    public fields_options = {
        'threecode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'enname': {
            'maxlen': '32',
            'type': 'string32'
        },
        'numcode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'twocode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'telcode': {
            'maxlen': '8',
            'type': 'string8'
        },
        'areadesc': {
            'maxlen': '32',
            'type': 'string32'
        },
        'cnname': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'threecode',
        'enname',
        'numcode',
        'twocode',
        'telcode',
        'areadesc',
        'cnname'
    ];
}


export class UserParamesDelete extends FeildCheck {


    public userid: number;  // 用户id

    public paramsname: string;  // 配置名称

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'paramsname': {
            'maxlen': '16',
            'type': 'string16'
        },
    };

    public field_keys: string[] = [
        'userid',
        'paramsname'
    ];
}


export class UserParamesGet extends FeildCheck {


    public userid: number;  // 用户id

    public paramsname: string;  // 配置名称

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'paramsname': {
            'maxlen': '16',
            'type': 'string16'
        },
    };

    public field_keys: string[] = [
        'userid',
        'paramsname'
    ];
}


export class UserParamesPut extends FeildCheck {


    public userid: number;  // 用户id

    public paramssection: string;  // 配置段

    public paramsname: string;  // 配置名称

    public paramsvalue: string;  // 配置值

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32'
        },
        'paramssection': {
            'maxlen': '16',
            'type': 'string16'
        },
        'paramsname': {
            'maxlen': '16',
            'type': 'string16'
        },
        'paramsvalue': {
            'maxlen': '32',
            'type': 'string32'
        },
    };

    public field_keys: string[] = [
        'userid',
        'paramssection',
        'paramsname',
        'paramsvalue'
    ];
}

