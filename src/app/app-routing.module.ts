import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'
import { authGuard } from './auth.guard';

const routes: Routes = [{path: "sign-up", component: SignUpComponent},
{path: "login", component: LoginComponent},
{path: "dashboard", component: DashboardComponent, canActivate:[authGuard]},
{path: "**", redirectTo: "sign-up", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
