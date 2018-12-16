import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomViewComponent } from './room-view/room-view.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'rooms', component: RoomsComponent, pathMatch: 'full' },
  { path: 'rooms/:roomId', component: RoomViewComponent, pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
