import { SettingsService, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { SdkService } from '@sdk/sdk.service';
import { UserLoginPost } from '@sdk/sdk.model';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    _loading: boolean;

    /** 是否正在加载中 */
    get loading(): boolean {
        return this.sdk.loading;
    }
    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        @Inject(MenuService) private menuService: MenuService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        @Inject(SdkService) private sdk: SdkService) {
        this.form = fb.group({
            userName: ['system', [Validators.required, Validators.minLength(5)]],
            password: ['system', Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
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
    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.password.markAsDirty();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.captcha.markAsDirty();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        const params = new UserLoginPost();
        params.logincode = this.userName.value;
        params.password = this.password.value;
        params.clientver = '0.0.0.1';
        this.sdk.user_login_post_api(params).subscribe((res: any) => {
            // 清空路由复用信息
            this.reuseTabService.clear();
            // 登录要返回token（sid）
            this.tokenService.set({
                token: res.sid,
                name: this.userName.value,
                email: `cntway@qq.com`,
                id: 10000,
                time: +new Date
            });
            this.sdk.sys_menu_detail_get_api([], 1, 99999).subscribe((menuRes: any) => {
                let menuList = [];
                for (const row of menuRes.results) {
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
                // 初始化菜单
                this.menuService.clear();
                this.menuService.add(menuList);
                this.router.navigate(['/dashboard']);
            });

        });
    }
    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
