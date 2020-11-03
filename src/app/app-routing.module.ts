import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TasklistComponent} from './components/tasklist/tasklist.component';
import {TaskComponent} from './components/task/task.component';


const routes: Routes = [
  {path: '', redirectTo: 'Home', pathMatch: 'full'},
  {path: 'Home', component: TasklistComponent},
  {path: 'Task', component: TaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
