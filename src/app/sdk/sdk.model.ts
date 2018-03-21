import * as admins_enums from './sdk.admins_enum';
import * as users_enums from './sdk.users_enum';
import * as bcexs_enums from './sdk.bcexs_enum';
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

            if (class_obj === undefined) {
                try {
                    class_obj = bcexs_enums[enum_name];
                } catch (error) {
                    throw (new FeildCheckError(_(`无效枚举名称[${enum_name}]`)));
                }
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
            } else if (options['type'].length > 4 && (
                options['type'].slice(0, 4) === 'Enum' ||
                options['type'].slice(-4) === 'Enum')) {
                FeildCheck.check_field_enum(options['type'], key, val);
            } else {
                throw (new FeildCheckError(_('枚举名称定义格式不符')));
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
            'type': 'string',
            'typeValue': 'string'
        },
        'password': {
            'maxlen': '32',
            'minlen': '6',
            'maxval': 'none',
            'minval': 'none',
            'type': 'string',
            'typeValue': 'string'
        },
        'clientver': {
            'maxlen': '16',
            'minlen': '6',
            'maxval': 'none',
            'minval': 'none',
            'type': 'string',
            'typeValue': 'string'
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
            'type': 'int32',
            'typeValue': 'number'
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
            'type': 'int32',
            'typeValue': 'number'
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
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'menuid'
    ];
}


export class SysMenuPost extends FeildCheck {


    public funckey: string;  // 前端用配置字段

    public remark: string;  // 备忘

    public commituri: string;  // 提交接口地址

    public isstop: admins_enums.EnumIsStopType;  // 是否停用

    public parentid: number;  // 父菜单id

    public isshow: admins_enums.EnumIsStopType;  // 是否显示

    public apikey: string;  // 接口名称

    public sortid: number;  // 显示顺序

    public menuname: string;  // 菜单名称

    public pagehref: string;  // 页面地址

    public productid: number;  // 产品id

    public fields_options = {
        'funckey': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'remark': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'commituri': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'isstop': {
            'maxlen': 'none',
            'type': 'EnumIsStopType',
            'typeValue': 'admins_enums.EnumIsStopType'
        },
        'parentid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'isshow': {
            'maxlen': 'none',
            'type': 'EnumIsStopType',
            'typeValue': 'admins_enums.EnumIsStopType'
        },
        'apikey': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'sortid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'menuname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'pagehref': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'productid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'funckey',
        'remark',
        'commituri',
        'isstop',
        'parentid',
        'isshow',
        'apikey',
        'sortid',
        'menuname',
        'pagehref',
        'productid'
    ];
}


export class SysMenuPut extends FeildCheck {


    public funckey: string;  // 前端用配置字段

    public pagehref: string;  // 页面地址

    public remark: string;  // 备忘

    public commituri: string;  // 提交接口地址

    public parentids: string;  // 父菜单结构

    public parentid: number;  // 父菜单id

    public isshow: admins_enums.EnumIsStopType;  // 是否显示

    public productid: number;  // 产品id

    public apikey: string;  // 接口名称

    public menuid: number;  // 菜单id

    public sortid: number;  // 显示顺序

    public isstop: admins_enums.EnumIsStopType;  // 是否停用

    public menuname: string;  // 菜单名称

    public fields_options = {
        'funckey': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'pagehref': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'remark': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'commituri': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'parentids': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'parentid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'isshow': {
            'maxlen': 'none',
            'type': 'EnumIsStopType',
            'typeValue': 'admins_enums.EnumIsStopType'
        },
        'productid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'apikey': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'menuid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'sortid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'isstop': {
            'maxlen': 'none',
            'type': 'EnumIsStopType',
            'typeValue': 'admins_enums.EnumIsStopType'
        },
        'menuname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'funckey',
        'pagehref',
        'remark',
        'commituri',
        'parentids',
        'parentid',
        'isshow',
        'productid',
        'apikey',
        'menuid',
        'sortid',
        'isstop',
        'menuname'
    ];
}


export class SysRoleDelete extends FeildCheck {


    public roleid: number;  // 角色id

    public fields_options = {
        'roleid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'roleid'
    ];
}


export class SysRoleMenuGet extends FeildCheck {


    public roleid: number;  // 角色id

    public fields_options = {
        'roleid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
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
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'roleid'
    ];
}


export class SysRolePost extends FeildCheck {


    public roletype: admins_enums.EnumUserType;  // 角色类型

    public rolename: string;  // 角色名称

    public fields_options = {
        'roletype': {
            'maxlen': 'none',
            'type': 'EnumUserType',
            'typeValue': 'admins_enums.EnumUserType'
        },
        'rolename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'roletype',
        'rolename'
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
            'type': 'int32',
            'typeValue': 'number'
        },
        'menuids': {
            'maxlen': 'none',
            'minlen': 'none',
            'maxval': 'none',
            'minval': 'none',
            'type': 'list_int32',
            'typeValue': 'number[]'
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
            'type': 'int32',
            'typeValue': 'number'
        },
        'rolename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'roleid',
        'rolename'
    ];
}


export class MuserUsersChangepwdPut extends FeildCheck {


    public src_userpwd: string;  // 用户密码

    public new_userpwd: string;  // 用户密码

    public fields_options = {
        'src_userpwd': {
            'maxlen': '24',
            'type': 'byte24',
            'typeValue': 'string'
        },
        'new_userpwd': {
            'maxlen': '24',
            'type': 'byte24',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'src_userpwd',
        'new_userpwd'
    ];
}


export class MuserUsersDelete extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
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
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class MuserUsersPost extends FeildCheck {


    public userstatus: admins_enums.EnumUserStatus;  // 用户状态

    public phone: string;  // 手机号码

    public nikename: string;  // 用户昵称

    public email: string;  // 电子邮箱

    public userpwd: string;  // 用户密码

    public username: string;  // 用户姓名

    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public logincode: string;  // 登录账号

    public idtype: admins_enums.EnumIdType;  // 证件类型

    public fields_options = {
        'userstatus': {
            'maxlen': 'none',
            'type': 'EnumUserStatus',
            'typeValue': 'admins_enums.EnumUserStatus'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userpwd': {
            'maxlen': '24',
            'type': 'byte24',
            'typeValue': 'string'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'string'
        },
        'logincode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'admins_enums.EnumIdType'
        },
    };

    public field_keys: string[] = [
        'userstatus',
        'phone',
        'nikename',
        'email',
        'userpwd',
        'username',
        'idcard',
        'idcardvaild',
        'logincode',
        'idtype'
    ];
}


export class MuserUsersResetpwdPut extends FeildCheck {


    public userid: number;  // 用户id

    public userpwd: string;  // 用户密码

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'userpwd': {
            'maxlen': '24',
            'type': 'byte24',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'userid',
        'userpwd'
    ];
}


export class MuserUsersPut extends FeildCheck {


    public phone: string;  // 手机号码

    public username: string;  // 用户姓名

    public userid: number;  // 用户id

    public email: string;  // 电子邮箱

    public idcard: string;  // 证件号码

    public nikename: string;  // 用户昵称

    public idcardvaild: string;  // 证件有效期

    public idtype: admins_enums.EnumIdType;  // 证件类型

    public fields_options = {
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'string'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'admins_enums.EnumIdType'
        },
    };

    public field_keys: string[] = [
        'phone',
        'username',
        'userid',
        'email',
        'idcard',
        'nikename',
        'idcardvaild',
        'idtype'
    ];
}


export class MuserParamesDelete extends FeildCheck {


    public paramsname: string;  // 配置名称

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'paramsname'
    ];
}


export class MuserParamesGet extends FeildCheck {


    public paramsname: string;  // 配置名称

    public userid: number;  // 用户id

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'paramsname',
        'userid'
    ];
}


export class MuserParamesPut extends FeildCheck {


    public paramsname: string;  // 配置名称

    public paramssection: string;  // 配置段

    public paramsvalue: string;  // 配置值

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'paramssection': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'paramsvalue': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'paramsname',
        'paramssection',
        'paramsvalue'
    ];
}


export class UsersStepOnePost extends FeildCheck {


    public telcode: string;  // 电话区号

    public username: string;  // 用户姓名

    public country: string;  // 国籍

    public userid: number;  // 用户id

    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public idtype: users_enums.EnumIdType;  // 证件类型

    public fields_options = {
        'telcode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'string'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'users_enums.EnumIdType'
        },
    };

    public field_keys: string[] = [
        'telcode',
        'username',
        'country',
        'userid',
        'idcard',
        'idcardvaild',
        'idtype'
    ];
}


export class UsersStepOnePut extends FeildCheck {


    public reviewid: number;  // 审核id

    public lastopstatus: admins_enums.EnumDataReviewStatus;  // 最后审核状态

    public lastopdesc: string;  // 最后审核描述

    public fields_options = {
        'reviewid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'lastopstatus': {
            'maxlen': 'none',
            'type': 'EnumDataReviewStatus',
            'typeValue': 'admins_enums.EnumDataReviewStatus'
        },
        'lastopdesc': {
            'maxlen': '64',
            'type': 'string64',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'reviewid',
        'lastopstatus',
        'lastopdesc'
    ];
}


export class BonusRuleDelete extends FeildCheck {


    public ruleid: number;  // 规则id

    public fields_options = {
        'ruleid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'ruleid'
    ];
}


export class BonusRuleGet extends FeildCheck {


    public ruleid: number;  // 规则id

    public fields_options = {
        'ruleid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'ruleid'
    ];
}


export class BonusRulePost extends FeildCheck {


    public upper: number;  // 积分范围H

    public lower: number;  // 积分范围L

    public bonustype: bcexs_enums.BonusEnum;  // 积分类型

    public bonus: number;  // 积分

    public pairid: number;  // 交易对id

    public fields_options = {
        'upper': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'lower': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'bonustype': {
            'type': 'BonusEnum',
            'typeValue': 'bcexs_enums.BonusEnum'
        },
        'bonus': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'upper',
        'lower',
        'bonustype',
        'bonus',
        'pairid'
    ];
}


export class BonusVipPrivilegeDelete extends FeildCheck {


    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public fields_options = {
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
    };

    public field_keys: string[] = [
        'vipclass'
    ];
}


export class BonusVipPrivilegeGet extends FeildCheck {


    public ruleid: number;  // 规则id

    public fields_options = {
        'ruleid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'ruleid'
    ];
}


export class BonusVipPrivilegePost extends FeildCheck {


    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public wddiscount: number;  // 提现折扣

    public wdamountmulti: number;  // 提现额度倍数

    public wdtimesmulti: number;  // 提现次数倍数

    public makerdiscount: number;  // maker折扣

    public takerdiscount: number;  // taker折扣

    public fields_options = {
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
        'wddiscount': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdamountmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'wdtimesmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'makerdiscount': {
            'type': 'double',
            'typeValue': 'number'
        },
        'takerdiscount': {
            'type': 'double',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'vipclass',
        'wddiscount',
        'wdamountmulti',
        'wdtimesmulti',
        'makerdiscount',
        'takerdiscount'
    ];
}


export class BonusVipPrivilegePut extends FeildCheck {


    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public wddiscount: number;  // 提现折扣

    public wdamountmulti: number;  // 提现额度倍数

    public wdtimesmulti: number;  // 提现次数倍数

    public makerdiscount: number;  // maker折扣

    public takerdiscount: number;  // taker折扣

    public fields_options = {
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
        'wddiscount': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdamountmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'wdtimesmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'makerdiscount': {
            'type': 'double',
            'typeValue': 'number'
        },
        'takerdiscount': {
            'type': 'double',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'vipclass',
        'wddiscount',
        'wdamountmulti',
        'wdtimesmulti',
        'makerdiscount',
        'takerdiscount'
    ];
}


export class BonusVipRuleDelete extends FeildCheck {


    public ruleid: number;  // 规则id

    public fields_options = {
        'ruleid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'ruleid'
    ];
}


export class BonusVipRuleGet extends FeildCheck {


    public ruleid: number;  // 规则id

    public fields_options = {
        'ruleid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'ruleid'
    ];
}


export class BonusVipRulePost extends FeildCheck {


    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public bonusupper: number;  // 等级积分最高

    public bonuslower: number;  // 等级积分最低

    public fields_options = {
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
        'bonusupper': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'bonuslower': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'vipclass',
        'bonusupper',
        'bonuslower'
    ];
}


export class BonusVipRulePut extends FeildCheck {


    public bonusupper: number;  // 等级积分最高

    public ruleid: number;  // 规则id

    public bonuslower: number;  // 等级积分最低

    public fields_options = {
        'bonusupper': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'ruleid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'bonuslower': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'bonusupper',
        'ruleid',
        'bonuslower'
    ];
}


export class CoinInfoGet extends FeildCheck {


    public coincode: string;  // 币代码

    public fields_options = {
        'coincode': {
            'maxlen': '8',
            'type': 'string8',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'coincode'
    ];
}


export class CoinInfoPost extends FeildCheck {


    public pubtime: string;  // 上市时间

    public coincnname: string;  // 币种中文名

    public coinname: string;  // 币种名称

    public coincode: string;  // 币代码

    public wdstatus: bcexs_enums.IOStatusEnum;  // 提现状态

    public refillstatus: bcexs_enums.IOStatusEnum;  // 充值状态

    public fields_options = {
        'pubtime': {
            'type': 'string',
            'typeValue': 'string'
        },
        'coincnname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'coinname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'coincode': {
            'type': 'string',
            'typeValue': 'string'
        },
        'wdstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
        'refillstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
    };

    public field_keys: string[] = [
        'pubtime',
        'coincnname',
        'coinname',
        'coincode',
        'wdstatus',
        'refillstatus'
    ];
}


export class CoinInfoPut extends FeildCheck {


    public pubtime: string;  // 上市时间

    public coincnname: string;  // 币种中文名

    public coinname: string;  // 币种名称

    public coincode: string;  // 币代码

    public wdstatus: bcexs_enums.IOStatusEnum;  // 提现状态

    public refillstatus: bcexs_enums.IOStatusEnum;  // 充值状态

    public fields_options = {
        'pubtime': {
            'type': 'string',
            'typeValue': 'string'
        },
        'coincnname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'coinname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'coincode': {
            'type': 'string',
            'typeValue': 'string'
        },
        'wdstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
        'refillstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
    };

    public field_keys: string[] = [
        'pubtime',
        'coincnname',
        'coinname',
        'coincode',
        'wdstatus',
        'refillstatus'
    ];
}


export class CoinPairGet extends FeildCheck {


    public pairid: number;  // 交易对id

    public fields_options = {
        'pairid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'pairid'
    ];
}


export class CoinPairPost extends FeildCheck {


    public pairstatus: bcexs_enums.PairStatusEnum;  // 交易对状态

    public pricescale: number;  // 报价小数位

    public currencycode: string;  // 交易对结算币

    public pairname: string;  // 交易对名称

    public amountscale: number;  // 金额小数位

    public marketid: number;  // 市场id

    public symbolcode: string;  // 交易对标的币

    public fields_options = {
        'pairstatus': {
            'type': 'PairStatusEnum',
            'typeValue': 'bcexs_enums.PairStatusEnum'
        },
        'pricescale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'currencycode': {
            'type': 'string',
            'typeValue': 'string'
        },
        'pairname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'amountscale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'marketid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'symbolcode': {
            'type': 'string',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'pairstatus',
        'pricescale',
        'currencycode',
        'pairname',
        'amountscale',
        'marketid',
        'symbolcode'
    ];
}


export class CoinPairPut extends FeildCheck {


    public pairstatus: bcexs_enums.PairStatusEnum;  // 交易对状态

    public pricescale: number;  // 报价小数位

    public amountscale: number;  // 金额小数位

    public pairid: number;  // 交易对id

    public fields_options = {
        'pairstatus': {
            'type': 'PairStatusEnum',
            'typeValue': 'bcexs_enums.PairStatusEnum'
        },
        'pricescale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'amountscale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'pairstatus',
        'pricescale',
        'amountscale',
        'pairid'
    ];
}


export class BcexMarketGet extends FeildCheck {


    public marketid: number;  // 交易市场Id

    public fields_options = {
        'marketid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'marketid'
    ];
}


export class BcexMarketPut extends FeildCheck {


    public opofocmarket: bcexs_enums.OperatorEnum;  // 开休市模式

    public trademodel: bcexs_enums.MarketModeEnum;  // 交易模式

    public tradestatus: bcexs_enums.TradeStatusEnum;  // 交易状态

    public marketid: number;  // 交易市场Id

    public settlementtype: bcexs_enums.SettlementEnum;  // 结算负债模式

    public opofsettlement: bcexs_enums.OperatorEnum;  // 结算模式

    public risktype: bcexs_enums.RiskEnum;  // 风险率计算公式

    public marketname: string;  // 交易市场名称

    public fields_options = {
        'opofocmarket': {
            'type': 'OperatorEnum',
            'typeValue': 'bcexs_enums.OperatorEnum'
        },
        'trademodel': {
            'type': 'MarketModeEnum',
            'typeValue': 'bcexs_enums.MarketModeEnum'
        },
        'tradestatus': {
            'type': 'TradeStatusEnum',
            'typeValue': 'bcexs_enums.TradeStatusEnum'
        },
        'marketid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'settlementtype': {
            'type': 'SettlementEnum',
            'typeValue': 'bcexs_enums.SettlementEnum'
        },
        'opofsettlement': {
            'type': 'OperatorEnum',
            'typeValue': 'bcexs_enums.OperatorEnum'
        },
        'risktype': {
            'type': 'RiskEnum',
            'typeValue': 'bcexs_enums.RiskEnum'
        },
        'marketname': {
            'type': 'string',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'opofocmarket',
        'trademodel',
        'tradestatus',
        'marketid',
        'settlementtype',
        'opofsettlement',
        'risktype',
        'marketname'
    ];
}


export class UserUsersContactGet extends FeildCheck {


    public userid: number;  // 用户id

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
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
            'type': 'int32',
            'typeValue': 'number'
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
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'userid'
    ];
}


export class UserStatusUsersGet extends FeildCheck {


    public statustype: users_enums.EnumUserStatusType;  // 状态类型

    public userid: number;  // 用户id

    public fields_options = {
        'statustype': {
            'maxlen': 'none',
            'type': 'EnumUserStatusType',
            'typeValue': 'users_enums.EnumUserStatusType'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'statustype',
        'userid'
    ];
}


export class UserUsersPost extends FeildCheck {


    public phone: string;  // 手机号码

    public jsoncache: string;  // 附加字段

    public email: string;  // 电子邮箱

    public nikename: string;  // 用户昵称

    public telcode: string;  // 电话区号

    public username: string;  // 用户姓名

    public country: string;  // 国籍

    public idtype: users_enums.EnumIdType;  // 证件类型

    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public logincode: string;  // 登录账号

    public userpwd: string;  // 用户密码

    public fields_options = {
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'jsoncache': {
            'maxlen': '512',
            'type': 'jsonString',
            'typeValue': 'string'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'telcode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'users_enums.EnumIdType'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'string'
        },
        'logincode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userpwd': {
            'maxlen': '64',
            'type': 'string64',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'phone',
        'jsoncache',
        'email',
        'nikename',
        'telcode',
        'username',
        'country',
        'idtype',
        'idcard',
        'idcardvaild',
        'logincode',
        'userpwd'
    ];
}


export class UserUsersContactPut extends FeildCheck {


    public phone: string;  // 手机号码

    public email: string;  // 电子邮箱

    public telcode: string;  // 电话区号

    public country: string;  // 国籍

    public userid: number;  // 用户id

    public fields_options = {
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'telcode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'phone',
        'email',
        'telcode',
        'country',
        'userid'
    ];
}


export class UserUsersIdcardPut extends FeildCheck {


    public idcard: string;  // 证件号码

    public idcardvaild: string;  // 证件有效期

    public userid: number;  // 用户id

    public idtype: users_enums.EnumIdType;  // 证件类型

    public fields_options = {
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'users_enums.EnumIdType'
        },
    };

    public field_keys: string[] = [
        'idcard',
        'idcardvaild',
        'userid',
        'idtype'
    ];
}


export class UserUsersPut extends FeildCheck {


    public jsoncache: string;  // 附加字段

    public nikename: string;  // 用户昵称

    public username: string;  // 用户姓名

    public userid: number;  // 用户id

    public fields_options = {
        'jsoncache': {
            'maxlen': '512',
            'type': 'jsonString',
            'typeValue': 'string'
        },
        'nikename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'jsoncache',
        'nikename',
        'username',
        'userid'
    ];
}


export class UserStatusUsersPut extends FeildCheck {


    public statusvalue: string;  // 状态值

    public userid: number;  // 用户id

    public fields_options = {
        'statusvalue': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'statusvalue',
        'userid'
    ];
}


export class UserAreacodeDelete extends FeildCheck {


    public numcode: string;  // 数字编码

    public fields_options = {
        'numcode': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
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
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'numcode'
    ];
}


export class UserAreacodePost extends FeildCheck {


    public enname: string;  // 英文名称

    public areadesc: string;  // 备注信息

    public threecode: string;  // 三位编码

    public telcode: string;  // 手机区号

    public twocode: string;  // 二位编码

    public cnname: string;  // 中文名称

    public numcode: string;  // 数字编码

    public fields_options = {
        'enname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'areadesc': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'threecode': {
            'maxlen': '8',
            'type': 'string8',
            'typeValue': 'string'
        },
        'telcode': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'twocode': {
            'maxlen': '8',
            'type': 'string8',
            'typeValue': 'string'
        },
        'cnname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'numcode': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'enname',
        'areadesc',
        'threecode',
        'telcode',
        'twocode',
        'cnname',
        'numcode'
    ];
}


export class UserAreacodePut extends FeildCheck {


    public areadesc: string;  // 备注信息

    public telcode: string;  // 手机区号

    public twocode: string;  // 二位编码

    public enname: string;  // 英文名称

    public threecode: string;  // 三位编码

    public cnname: string;  // 中文名称

    public numcode: string;  // 数字编码

    public fields_options = {
        'areadesc': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'telcode': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'twocode': {
            'maxlen': '8',
            'type': 'string8',
            'typeValue': 'string'
        },
        'enname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'threecode': {
            'maxlen': '8',
            'type': 'string8',
            'typeValue': 'string'
        },
        'cnname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'numcode': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'areadesc',
        'telcode',
        'twocode',
        'enname',
        'threecode',
        'cnname',
        'numcode'
    ];
}


export class UserParamesDelete extends FeildCheck {


    public paramsname: string;  // 配置名称

    public userid: number;  // 用户id

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'paramsname',
        'userid'
    ];
}


export class UserParamesGet extends FeildCheck {


    public paramsname: string;  // 配置名称

    public userid: number;  // 用户id

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'paramsname',
        'userid'
    ];
}


export class UserParamesPut extends FeildCheck {


    public paramsname: string;  // 配置名称

    public paramsvalue: string;  // 配置值

    public userid: number;  // 用户id

    public paramssection: string;  // 配置段

    public fields_options = {
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
        'paramsvalue': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'paramssection': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'paramsname',
        'paramsvalue',
        'userid',
        'paramssection'
    ];
}

