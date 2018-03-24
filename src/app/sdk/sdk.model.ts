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
        if (isDate(val)) {
            return;
        }
        const regix = new RegExp('^[0-9]{4}[0-9]{2}[0-9]{2}T[0-9]{2}[0-9]{2}[0-9]{2}$', 'g');
        if (!val.match(regix)) {
            throw (new FeildCheckError(_(`无效时间格式[${key}][YYYYmmDDTHHMMSS]`)));
        }
    }

    public static check_field_date(options: {}, key: string, val: string): void {
        if (isDate(val)) {
            return;
        }
        const regix = new RegExp('^[0-9]{4}[0-9]{2}[0-9]{2}$', 'g');
        if (!val.match(regix)) {
            throw (new FeildCheckError(_(`无效时间格式[${key}][YYYYmmDD]`)));
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


    public remark: string;  // 备忘

    public sortid: number;  // 显示顺序

    public parentid: number;  // 父菜单id

    public isstop: admins_enums.EnumIsStopType;  // 是否停用

    public isshow: admins_enums.EnumIsStopType;  // 是否显示

    public apikey: string;  // 接口名称

    public menuname: string;  // 菜单名称

    public commituri: string;  // 提交接口地址

    public productid: number;  // 产品id

    public pagehref: string;  // 页面地址

    public funckey: string;  // 前端用配置字段

    public fields_options = {
        'remark': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'sortid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'parentid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'isstop': {
            'maxlen': 'none',
            'type': 'EnumIsStopType',
            'typeValue': 'admins_enums.EnumIsStopType'
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
        'menuname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'commituri': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'productid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'pagehref': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'funckey': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'remark',
        'sortid',
        'parentid',
        'isstop',
        'isshow',
        'apikey',
        'menuname',
        'commituri',
        'productid',
        'pagehref',
        'funckey'
    ];
}


export class SysMenuPut extends FeildCheck {


    public remark: string;  // 备忘

    public sortid: number;  // 显示顺序

    public isstop: admins_enums.EnumIsStopType;  // 是否停用

    public parentid: number;  // 父菜单id

    public isshow: admins_enums.EnumIsStopType;  // 是否显示

    public apikey: string;  // 接口名称

    public funckey: string;  // 前端用配置字段

    public menuname: string;  // 菜单名称

    public parentids: string;  // 父菜单结构

    public productid: number;  // 产品id

    public pagehref: string;  // 页面地址

    public menuid: number;  // 菜单id

    public commituri: string;  // 提交接口地址

    public fields_options = {
        'remark': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
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
        'funckey': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'menuname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'parentids': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'productid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'pagehref': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'menuid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'commituri': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'remark',
        'sortid',
        'isstop',
        'parentid',
        'isshow',
        'apikey',
        'funckey',
        'menuname',
        'parentids',
        'productid',
        'pagehref',
        'menuid',
        'commituri'
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


    public rolename: string;  // 角色名称

    public roletype: admins_enums.EnumUserType;  // 角色类型

    public fields_options = {
        'rolename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'roletype': {
            'maxlen': 'none',
            'type': 'EnumUserType',
            'typeValue': 'admins_enums.EnumUserType'
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


    public rolename: string;  // 角色名称

    public roleid: number;  // 角色id

    public fields_options = {
        'rolename': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'roleid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'rolename',
        'roleid'
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


    public idtype: admins_enums.EnumIdType;  // 证件类型

    public idcardvaild: Date;  // 证件有效期

    public phone: string;  // 手机号码

    public userstatus: admins_enums.EnumUserStatus;  // 用户状态

    public logincode: string;  // 登录账号

    public idcard: string;  // 证件号码

    public userpwd: string;  // 用户密码

    public username: string;  // 用户姓名

    public nikename: string;  // 用户昵称

    public email: string;  // 电子邮箱

    public fields_options = {
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'admins_enums.EnumIdType'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'Date'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userstatus': {
            'maxlen': 'none',
            'type': 'EnumUserStatus',
            'typeValue': 'admins_enums.EnumUserStatus'
        },
        'logincode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcard': {
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
    };

    public field_keys: string[] = [
        'idtype',
        'idcardvaild',
        'phone',
        'userstatus',
        'logincode',
        'idcard',
        'userpwd',
        'username',
        'nikename',
        'email'
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


    public idtype: admins_enums.EnumIdType;  // 证件类型

    public userid: number;  // 用户id

    public idcardvaild: Date;  // 证件有效期

    public phone: string;  // 手机号码

    public idcard: string;  // 证件号码

    public username: string;  // 用户姓名

    public nikename: string;  // 用户昵称

    public email: string;  // 电子邮箱

    public fields_options = {
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'admins_enums.EnumIdType'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'Date'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'username': {
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
    };

    public field_keys: string[] = [
        'idtype',
        'userid',
        'idcardvaild',
        'phone',
        'idcard',
        'username',
        'nikename',
        'email'
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


    public paramssection: string;  // 配置段

    public paramsvalue: string;  // 配置值

    public paramsname: string;  // 配置名称

    public fields_options = {
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
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'paramssection',
        'paramsvalue',
        'paramsname'
    ];
}


export class UsersStepOnePost extends FeildCheck {


    public idtype: users_enums.EnumIdType;  // 证件类型

    public idcardvaild: Date;  // 证件有效期

    public country: string;  // 国籍

    public idcard: string;  // 证件号码

    public telcode: string;  // 电话区号

    public username: string;  // 用户姓名

    public userid: number;  // 用户id

    public fields_options = {
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'users_enums.EnumIdType'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'Date'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idcard': {
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
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'idtype',
        'idcardvaild',
        'country',
        'idcard',
        'telcode',
        'username',
        'userid'
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


    public pairid: number;  // 交易对id

    public upper: number;  // 积分范围H

    public lower: number;  // 积分范围L

    public bonus: number;  // 积分

    public bonustype: bcexs_enums.BonusEnum;  // 积分类型

    public fields_options = {
        'pairid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'upper': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'lower': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'bonus': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'bonustype': {
            'type': 'BonusEnum',
            'typeValue': 'bcexs_enums.BonusEnum'
        },
    };

    public field_keys: string[] = [
        'pairid',
        'upper',
        'lower',
        'bonus',
        'bonustype'
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


    public wdamountmulti: number;  // 提现额度倍数

    public wddiscount: number;  // 提现折扣

    public makerdiscount: number;  // maker折扣

    public takerdiscount: number;  // taker折扣

    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public wdtimesmulti: number;  // 提现次数倍数

    public fields_options = {
        'wdamountmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'wddiscount': {
            'type': 'double',
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
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
        'wdtimesmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'wdamountmulti',
        'wddiscount',
        'makerdiscount',
        'takerdiscount',
        'vipclass',
        'wdtimesmulti'
    ];
}


export class BonusVipPrivilegePut extends FeildCheck {


    public wdamountmulti: number;  // 提现额度倍数

    public wddiscount: number;  // 提现折扣

    public makerdiscount: number;  // maker折扣

    public takerdiscount: number;  // taker折扣

    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public wdtimesmulti: number;  // 提现次数倍数

    public fields_options = {
        'wdamountmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'wddiscount': {
            'type': 'double',
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
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
        'wdtimesmulti': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'wdamountmulti',
        'wddiscount',
        'makerdiscount',
        'takerdiscount',
        'vipclass',
        'wdtimesmulti'
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


    public bonusupper: number;  // 等级积分最高

    public bonuslower: number;  // 等级积分最低

    public vipclass: bcexs_enums.VipEnum;  // vip等级

    public fields_options = {
        'bonusupper': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'bonuslower': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'vipclass': {
            'type': 'VipEnum',
            'typeValue': 'bcexs_enums.VipEnum'
        },
    };

    public field_keys: string[] = [
        'bonusupper',
        'bonuslower',
        'vipclass'
    ];
}


export class BonusVipRulePut extends FeildCheck {


    public ruleid: number;  // 规则id

    public bonusupper: number;  // 等级积分最高

    public bonuslower: number;  // 等级积分最低

    public fields_options = {
        'ruleid': {
            'type': 'int32',
            'typeValue': 'number'
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
        'ruleid',
        'bonusupper',
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


    public coincnname: string;  // 币种中文名

    public pubtime: Date;  // 上市时间

    public wdstatus: bcexs_enums.IOStatusEnum;  // 提现状态

    public coinname: string;  // 币种名称

    public refillstatus: bcexs_enums.IOStatusEnum;  // 充值状态

    public coincode: string;  // 币代码

    public fields_options = {
        'coincnname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'pubtime': {
            'type': 'datetime',
            'typeValue': 'Date'
        },
        'wdstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
        'coinname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'refillstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
        'coincode': {
            'type': 'string',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'coincnname',
        'pubtime',
        'wdstatus',
        'coinname',
        'refillstatus',
        'coincode'
    ];
}


export class CoinInfoPut extends FeildCheck {


    public coincnname: string;  // 币种中文名

    public pubtime: Date;  // 上市时间

    public wdstatus: bcexs_enums.IOStatusEnum;  // 提现状态

    public coinname: string;  // 币种名称

    public refillstatus: bcexs_enums.IOStatusEnum;  // 充值状态

    public coincode: string;  // 币代码

    public fields_options = {
        'coincnname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'pubtime': {
            'type': 'datetime',
            'typeValue': 'Date'
        },
        'wdstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
        'coinname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'refillstatus': {
            'type': 'IOStatusEnum',
            'typeValue': 'bcexs_enums.IOStatusEnum'
        },
        'coincode': {
            'type': 'string',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'coincnname',
        'pubtime',
        'wdstatus',
        'coinname',
        'refillstatus',
        'coincode'
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


    public symbolcode: string;  // 交易对标的币

    public currencycode: string;  // 交易对结算币

    public marketid: number;  // 市场id

    public pairname: string;  // 交易对名称

    public pricescale: number;  // 报价小数位

    public amountscale: number;  // 金额小数位

    public pairstatus: bcexs_enums.PairStatusEnum;  // 交易对状态

    public fields_options = {
        'symbolcode': {
            'type': 'string',
            'typeValue': 'string'
        },
        'currencycode': {
            'type': 'string',
            'typeValue': 'string'
        },
        'marketid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'pricescale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'amountscale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairstatus': {
            'type': 'PairStatusEnum',
            'typeValue': 'bcexs_enums.PairStatusEnum'
        },
    };

    public field_keys: string[] = [
        'symbolcode',
        'currencycode',
        'marketid',
        'pairname',
        'pricescale',
        'amountscale',
        'pairstatus'
    ];
}


export class CoinPairPut extends FeildCheck {


    public pairstatus: bcexs_enums.PairStatusEnum;  // 交易对状态

    public amountscale: number;  // 金额小数位

    public pricescale: number;  // 报价小数位

    public pairid: number;  // 交易对id

    public fields_options = {
        'pairstatus': {
            'type': 'PairStatusEnum',
            'typeValue': 'bcexs_enums.PairStatusEnum'
        },
        'amountscale': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pricescale': {
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
        'amountscale',
        'pricescale',
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


    public tradestatus: bcexs_enums.TradeStatusEnum;  // 交易状态

    public risktype: bcexs_enums.RiskEnum;  // 风险率计算公式

    public trademodel: bcexs_enums.MarketModeEnum;  // 交易模式

    public marketid: number;  // 交易市场Id

    public marketname: string;  // 交易市场名称

    public opofsettlement: bcexs_enums.OperatorEnum;  // 结算模式

    public settlementtype: bcexs_enums.SettlementEnum;  // 结算负债模式

    public opofocmarket: bcexs_enums.OperatorEnum;  // 开休市模式

    public fields_options = {
        'tradestatus': {
            'type': 'TradeStatusEnum',
            'typeValue': 'bcexs_enums.TradeStatusEnum'
        },
        'risktype': {
            'type': 'RiskEnum',
            'typeValue': 'bcexs_enums.RiskEnum'
        },
        'trademodel': {
            'type': 'MarketModeEnum',
            'typeValue': 'bcexs_enums.MarketModeEnum'
        },
        'marketid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'marketname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'opofsettlement': {
            'type': 'OperatorEnum',
            'typeValue': 'bcexs_enums.OperatorEnum'
        },
        'settlementtype': {
            'type': 'SettlementEnum',
            'typeValue': 'bcexs_enums.SettlementEnum'
        },
        'opofocmarket': {
            'type': 'OperatorEnum',
            'typeValue': 'bcexs_enums.OperatorEnum'
        },
    };

    public field_keys: string[] = [
        'tradestatus',
        'risktype',
        'trademodel',
        'marketid',
        'marketname',
        'opofsettlement',
        'settlementtype',
        'opofocmarket'
    ];
}


export class PairPropertyDelete extends FeildCheck {


    public propertyid: number;  // 属性id

    public fields_options = {
        'propertyid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertyid'
    ];
}


export class PairPropertyGet extends FeildCheck {


    public propertyid: number;  // 属性id

    public fields_options = {
        'propertyid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertyid'
    ];
}


export class PairPropertyPost extends FeildCheck {


    public quantitylimitday: number;  // 全天下单额度限制

    public takerfeeratio: number;  // 主动吃单手续费

    public wdamountlimit: number;  // 今日提现额度限制

    public wdtimeslimit: number;  // 今日提现次数限制

    public pairid: number;  // 交易对id

    public referrfeeratio: number;  // 推荐费

    public quantitylimitonce: number;  // 单次下单额度限制

    public makerfeeratio: number;  // 挂单成交手续费

    public wdfeeratio: number;  // 提现手续费

    public fields_options = {
        'quantitylimitday': {
            'type': 'double',
            'typeValue': 'number'
        },
        'takerfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdamountlimit': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdtimeslimit': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'referrfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
        'quantitylimitonce': {
            'type': 'double',
            'typeValue': 'number'
        },
        'makerfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'quantitylimitday',
        'takerfeeratio',
        'wdamountlimit',
        'wdtimeslimit',
        'pairid',
        'referrfeeratio',
        'quantitylimitonce',
        'makerfeeratio',
        'wdfeeratio'
    ];
}


export class PairPropertyPut extends FeildCheck {


    public quantitylimitday: number;  // 全天下单额度限制

    public takerfeeratio: number;  // 主动吃单手续费

    public wdamountlimit: number;  // 今日提现额度限制

    public wdtimeslimit: number;  // 今日提现次数限制

    public referrfeeratio: number;  // 推荐费

    public quantitylimitonce: number;  // 单次下单额度限制

    public propertyid: number;  // 属性id

    public makerfeeratio: number;  // 挂单成交手续费

    public wdfeeratio: number;  // 提现手续费

    public fields_options = {
        'quantitylimitday': {
            'type': 'double',
            'typeValue': 'number'
        },
        'takerfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdamountlimit': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdtimeslimit': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'referrfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
        'quantitylimitonce': {
            'type': 'double',
            'typeValue': 'number'
        },
        'propertyid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'makerfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
        'wdfeeratio': {
            'type': 'double',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'quantitylimitday',
        'takerfeeratio',
        'wdamountlimit',
        'wdtimeslimit',
        'referrfeeratio',
        'quantitylimitonce',
        'propertyid',
        'makerfeeratio',
        'wdfeeratio'
    ];
}


export class PairPropertyGroupDelete extends FeildCheck {


    public propertygroupid: number;  // 属性组id

    public fields_options = {
        'propertygroupid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertygroupid'
    ];
}


export class PairPropertyGroupGet extends FeildCheck {


    public propertygroupid: number;  // 属性组id

    public fields_options = {
        'propertygroupid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertygroupid'
    ];
}


export class PairPropertyGroupPost extends FeildCheck {


    public groupname: string;  // 属性组名称

    public note: string;  // 备注

    public fields_options = {
        'groupname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'note': {
            'type': 'string',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'groupname',
        'note'
    ];
}


export class PairPropertyGroupPut extends FeildCheck {


    public propertygroupid: number;  // 属性组id

    public groupname: string;  // 属性组名称

    public note: string;  // 备注

    public fields_options = {
        'propertygroupid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'groupname': {
            'type': 'string',
            'typeValue': 'string'
        },
        'note': {
            'type': 'string',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'propertygroupid',
        'groupname',
        'note'
    ];
}


export class PairPropertyGroupMapDelete extends FeildCheck {


    public propertygroupid: number;  // 属性组id

    public pairid: number;  // 交易对id

    public fields_options = {
        'propertygroupid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertygroupid',
        'pairid'
    ];
}


export class PairPropertyGroupMapGet extends FeildCheck {


    public propertygroupid: number;  // 属性组id

    public pairid: number;  // 交易对id

    public fields_options = {
        'propertygroupid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'pairid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertygroupid',
        'pairid'
    ];
}


export class PairPropertyGroupMapPost extends FeildCheck {


    public propertyid: number;  // 属性id

    public propertygroupid: number;  // 属性组id

    public fields_options = {
        'propertyid': {
            'type': 'int32',
            'typeValue': 'number'
        },
        'propertygroupid': {
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'propertyid',
        'propertygroupid'
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


    public idtype: users_enums.EnumIdType;  // 证件类型

    public idcardvaild: Date;  // 证件有效期

    public phone: string;  // 手机号码

    public country: string;  // 国籍

    public telcode: string;  // 电话区号

    public logincode: string;  // 登录账号

    public jsoncache: string;  // 附加字段

    public idcard: string;  // 证件号码

    public userpwd: string;  // 用户密码

    public username: string;  // 用户姓名

    public nikename: string;  // 用户昵称

    public email: string;  // 电子邮箱

    public fields_options = {
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'users_enums.EnumIdType'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'Date'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'telcode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'logincode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'jsoncache': {
            'maxlen': '512',
            'type': 'jsonString',
            'typeValue': 'string'
        },
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'userpwd': {
            'maxlen': '64',
            'type': 'string64',
            'typeValue': 'string'
        },
        'username': {
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
    };

    public field_keys: string[] = [
        'idtype',
        'idcardvaild',
        'phone',
        'country',
        'telcode',
        'logincode',
        'jsoncache',
        'idcard',
        'userpwd',
        'username',
        'nikename',
        'email'
    ];
}


export class UserUsersContactPut extends FeildCheck {


    public userid: number;  // 用户id

    public phone: string;  // 手机号码

    public country: string;  // 国籍

    public telcode: string;  // 电话区号

    public email: string;  // 电子邮箱

    public fields_options = {
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'phone': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'country': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'telcode': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'email': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'userid',
        'phone',
        'country',
        'telcode',
        'email'
    ];
}


export class UserUsersIdcardPut extends FeildCheck {


    public idcard: string;  // 证件号码

    public idtype: users_enums.EnumIdType;  // 证件类型

    public idcardvaild: Date;  // 证件有效期

    public userid: number;  // 用户id

    public fields_options = {
        'idcard': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'idtype': {
            'maxlen': 'none',
            'type': 'EnumIdType',
            'typeValue': 'users_enums.EnumIdType'
        },
        'idcardvaild': {
            'maxlen': 'none',
            'type': 'date',
            'typeValue': 'Date'
        },
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
    };

    public field_keys: string[] = [
        'idcard',
        'idtype',
        'idcardvaild',
        'userid'
    ];
}


export class UserUsersPut extends FeildCheck {


    public jsoncache: string;  // 附加字段

    public username: string;  // 用户姓名

    public nikename: string;  // 用户昵称

    public userid: number;  // 用户id

    public fields_options = {
        'jsoncache': {
            'maxlen': '512',
            'type': 'jsonString',
            'typeValue': 'string'
        },
        'username': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'nikename': {
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
        'username',
        'nikename',
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


    public cnname: string;  // 中文名称

    public areadesc: string;  // 备注信息

    public numcode: string;  // 数字编码

    public enname: string;  // 英文名称

    public threecode: string;  // 三位编码

    public telcode: string;  // 手机区号

    public twocode: string;  // 二位编码

    public fields_options = {
        'cnname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'areadesc': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'numcode': {
            'maxlen': '16',
            'type': 'string16',
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
    };

    public field_keys: string[] = [
        'cnname',
        'areadesc',
        'numcode',
        'enname',
        'threecode',
        'telcode',
        'twocode'
    ];
}


export class UserAreacodePut extends FeildCheck {


    public enname: string;  // 英文名称

    public cnname: string;  // 中文名称

    public threecode: string;  // 三位编码

    public areadesc: string;  // 备注信息

    public telcode: string;  // 手机区号

    public twocode: string;  // 二位编码

    public numcode: string;  // 数字编码

    public fields_options = {
        'enname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'cnname': {
            'maxlen': '32',
            'type': 'string32',
            'typeValue': 'string'
        },
        'threecode': {
            'maxlen': '8',
            'type': 'string8',
            'typeValue': 'string'
        },
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
        'numcode': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'enname',
        'cnname',
        'threecode',
        'areadesc',
        'telcode',
        'twocode',
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


    public paramssection: string;  // 配置段

    public paramsvalue: string;  // 配置值

    public userid: number;  // 用户id

    public paramsname: string;  // 配置名称

    public fields_options = {
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
        'userid': {
            'maxlen': 'none',
            'type': 'int32',
            'typeValue': 'number'
        },
        'paramsname': {
            'maxlen': '16',
            'type': 'string16',
            'typeValue': 'string'
        },
    };

    public field_keys: string[] = [
        'paramssection',
        'paramsvalue',
        'userid',
        'paramsname'
    ];
}

