import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs/observable/zip';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { I18NService } from '../i18n/i18n.service';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        private i18n: I18NService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private injector: Injector) { }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
                this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`),
                this.httpClient.get('assets/app-data.json'),
                this.httpClient.get('sys/menus/detail?page=[0,99999]')
            ).pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([langData, appData, menuData]) => {
                    resolve(null);
                    return [langData, appData, menuData];
                })
            ).subscribe(([langData, appData, menuData]) => {
                // setting language data
                this.translate.setTranslation(this.i18n.defaultLang, langData);
                this.translate.setDefaultLang(this.i18n.defaultLang);

                // application data
                const res: any = appData;
                // 应用信息：包括站点名、描述、年份
                this.settingService.setApp(res.app);
                // 用户信息：包括姓名、头像、邮箱地址
                this.settingService.setUser(res.user);
                // ACL：设置权限为全量
                this.aclService.setFull(true);
                let menuList = [];
                for (const row of menuData.results) {
                    const m = {};
                    m['text'] = row['menuname'];
                    m['link'] = row['pagehref'];
                    m['icon'] = row['remark'];
                    m['group'] = (row['parentid'] === 0);
                    m['translate'] = row['menuname'];
                    m['id'] = row['menuid'];
                    m['parentid'] = row['parentid'];
                    menuList.push(m);
                }
                menuList = this.transData(menuList, 'id', 'parentid', 'children');
                console.log(menuList);
                // 初始化菜单
                this.menuService.add(menuList);
                this.menuService.resume();

                // 设置页面标题的后缀
                this.titleService.suffix = res.app.name;
            },
                () => { },
                () => {
                    resolve(null);
                });
        });
    }
    transData(a, idStr, pidStr, chindrenStr) {
        let i = 0, j = 0;
        const r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            const aVal = a[j], hashVP = hash[aVal[pid]];
            if (typeof (hashVP) !== 'undefined') {
                if (!hashVP[children]) {
                    hashVP[children] = [];
                }
                hashVP[children].push(aVal);
                hashVP['hasChildren'] = true;
            } else {
                r.push(aVal);
            }
        }
        return r;
    }
}
