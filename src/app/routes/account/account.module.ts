import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { RoleComponent } from './role/role.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';
import { ManagerComponent } from './manager/manager.component';
import { MenuEditComponent } from './menu/menu-edit/menu-edit.component';
import { ManagerEditComponent } from './manager/manager-edit/manager-edit.component';
import { UserComponent } from './user/user.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEidtComponent } from './user/user-eidt/user-eidt.component';
import { AppfileComponent } from './appfile/appfile.component';
import { RoleAddComponent } from './role/role-add/role-add.component';
import { RoleRightComponent } from './role/role-right/role-right.component';
import { VipruleComponent } from './viprule/viprule.component';
import { VipruleAddComponent } from './viprule/viprule-add/viprule-add.component';
import { VipruleEditComponent } from './viprule/viprule-edit/viprule-edit.component';


const routes: Routes = [
    { path: 'role', component: RoleComponent },
    { path: 'manager', component: ManagerComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'user', component: UserComponent },
    { path: 'appfile', component: AppfileComponent },
    { path: 'viprule', component: VipruleComponent },

];

// 新增功能组件必须添加到该列表
const COMPONENTS_NOROUNT = [
    RoleEditComponent,
    MenuEditComponent,
    ManagerEditComponent,
    UserAddComponent,
    UserEidtComponent,
    RoleAddComponent,
    RoleRightComponent,
    VipruleEditComponent,
    VipruleAddComponent,
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    providers: [],
    declarations: [
        RoleComponent,
        ManagerComponent,
        MenuComponent,
        RoleEditComponent,
        ManagerEditComponent,
        UserComponent,
        UserAddComponent,
        UserEidtComponent,
        AppfileComponent,
        RoleAddComponent,
        RoleRightComponent,
        VipruleComponent,
        VipruleAddComponent,
        VipruleEditComponent,
        MenuEditComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents: COMPONENTS_NOROUNT
})
export class AccountModule { }
