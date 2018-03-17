import { parseQueryParam, QueryParam, FeildCheckError } from './sdk.util';
import * as model_sdk from './sdk.model';
import { SdkBase, SERVICE_URl } from './sdk.base';
import { Observable } from 'rxjs/Rx';

export class SdkService extends SdkBase {
    
    
    user_heartbeat_post_api(parames: model_sdk.UserHeartbeatPost): Observable<any> {
        const url = SERVICE_URl + '/login/heartbeat';
        return this.do('put', url, parames);
    }
    
    
    user_login_post_api(parames: model_sdk.UserLoginPost): Observable<any> {
        const url = SERVICE_URl + '/login/loging';
        return this.do('post', url, parames);
    }
    
    
    sys_menu_delete_api(parames: model_sdk.SysMenuDelete): Observable<any> {
        const url = SERVICE_URl + '/sys/menus';
        return this.do('delete', url, parames);
    }
    
    
    sys_menu_detail_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/sys/menus/detail';
        return this.do('get', url, parames);
    }
    
    sys_menu_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/sys/menus';
        return this.do('get', url, parames);
    }
    
    sys_menu_post_api(parames: model_sdk.SysMenuPost): Observable<any> {
        const url = SERVICE_URl + '/sys/menus';
        return this.do('post', url, parames);
    }
    
    
    sys_menu_put_api(parames: model_sdk.SysMenuPut): Observable<any> {
        const url = SERVICE_URl + '/sys/menus';
        return this.do('put', url, parames);
    }
    
    
    sys_role_delete_api(parames: model_sdk.SysRoleDelete): Observable<any> {
        const url = SERVICE_URl + '/sys/roles';
        return this.do('delete', url, parames);
    }
    
    
    sys_role_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/sys/roles';
        return this.do('get', url, parames);
    }
    
    sys_role_post_api(parames: model_sdk.SysRolePost): Observable<any> {
        const url = SERVICE_URl + '/sys/roles';
        return this.do('post', url, parames);
    }
    
    
    sys_role_menu_put_api(parames: model_sdk.SysRoleMenuPut): Observable<any> {
        const url = SERVICE_URl + '/sys/roles/menu';
        return this.do('put', url, parames);
    }
    
    
    sys_role_put_api(parames: model_sdk.SysRolePut): Observable<any> {
        const url = SERVICE_URl + '/sys/roles';
        return this.do('put', url, parames);
    }
    
    
    muser_users_delete_api(parames: model_sdk.MuserUsersDelete): Observable<any> {
        const url = SERVICE_URl + '/musers/users';
        return this.do('delete', url, parames);
    }
    
    
    muser_users_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/musers/users';
        return this.do('get', url, parames);
    }
    
    muser_users_post_api(parames: model_sdk.MuserUsersPost): Observable<any> {
        const url = SERVICE_URl + '/musers/users';
        return this.do('post', url, parames);
    }
    
    
    muser_users_put_api(parames: model_sdk.MuserUsersPut): Observable<any> {
        const url = SERVICE_URl + '/musers/users';
        return this.do('put', url, parames);
    }
    
    
    muser_parames_delete_api(parames: model_sdk.MuserParamesDelete): Observable<any> {
        const url = SERVICE_URl + '/musers/parames';
        return this.do('delete', url, parames);
    }
    
    
    muser_parames_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/musers/parames';
        return this.do('get', url, parames);
    }
    
    muser_parames_put_api(parames: model_sdk.MuserParamesPut): Observable<any> {
        const url = SERVICE_URl + '/musers/parames';
        return this.do('put', url, parames);
    }
    
    
    user_users_contact_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/users/users/contact';
        return this.do('get', url, parames);
    }
    
    user_users_idcard_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/users/users/idcard';
        return this.do('get', url, parames);
    }
    
    user_users_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/users/users';
        return this.do('get', url, parames);
    }
    
    user_status_users_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/users/users/stauts';
        return this.do('get', url, parames);
    }
    
    user_users_post_api(parames: model_sdk.UserUsersPost): Observable<any> {
        const url = SERVICE_URl + '/users/users';
        return this.do('post', url, parames);
    }
    
    
    user_users_contact_put_api(parames: model_sdk.UserUsersContactPut): Observable<any> {
        const url = SERVICE_URl + '/users/users/contact';
        return this.do('put', url, parames);
    }
    
    
    user_users_idcard_put_api(parames: model_sdk.UserUsersIdcardPut): Observable<any> {
        const url = SERVICE_URl + '/users/users/idcard';
        return this.do('put', url, parames);
    }
    
    
    user_users_put_api(parames: model_sdk.UserUsersPut): Observable<any> {
        const url = SERVICE_URl + '/users/users';
        return this.do('put', url, parames);
    }
    
    
    user_status_users_put_api(parames: model_sdk.UserStatusUsersPut): Observable<any> {
        const url = SERVICE_URl + '/users/users/stauts';
        return this.do('put', url, parames);
    }
    
    
    user_areacode_delete_api(parames: model_sdk.UserAreacodeDelete): Observable<any> {
        const url = SERVICE_URl + '/users/areacode';
        return this.do('delete', url, parames);
    }
    
    
    user_areacode_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/users/areacode';
        return this.do('get', url, parames);
    }
    
    user_areacode_post_api(parames: model_sdk.UserAreacodePost): Observable<any> {
        const url = SERVICE_URl + '/users/areacode';
        return this.do('post', url, parames);
    }
    
    
    user_areacode_put_api(parames: model_sdk.UserAreacodePut): Observable<any> {
        const url = SERVICE_URl + '/users/areacode';
        return this.do('put', url, parames);
    }
    
    
    user_parames_delete_api(parames: model_sdk.UserParamesDelete): Observable<any> {
        const url = SERVICE_URl + '/users/parames';
        return this.do('delete', url, parames);
    }
    
    
    user_parames_get_api(queryParam: Array<QueryParam>, PageIndex = 1, pageSize = 10, sort = ''): Observable<any> {
        const parames = { 'page': [(PageIndex - 1) * pageSize, pageSize] };
        if (sort !== '') {
            parames['sort'] = sort;
        }
        parames['where'] = parseQueryParam(queryParam);
        const url = SERVICE_URl + '/users/parames';
        return this.do('get', url, parames);
    }
    
    user_parames_put_api(parames: model_sdk.UserParamesPut): Observable<any> {
        const url = SERVICE_URl + '/users/parames';
        return this.do('put', url, parames);
    }
    
}
