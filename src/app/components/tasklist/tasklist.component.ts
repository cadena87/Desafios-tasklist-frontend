import {Component, OnInit} from '@angular/core';
import {Task, TaskStatus} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
})
export class TasklistComponent implements OnInit {

  tasklist: Task[];
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [10, 25, 50, 100];

  constructor(public service: TaskService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.findAll();
  }

  findAll() {
    this.service.showTasks()
      .then(value => {
        this.tasklist = value;

        this.tasklist.forEach(task => {
            task = this.service.getColor(task);
          }
        );

        this.tasklist.sort((a, b) => a.id - b.id);
      })
      .catch(err => console.log(err));
  }

  deleteTask(id: number) {
    this.service.deleteTask(id).subscribe(value => {
      if (value) {
        this.toastr.success('Tarefa excluída', 'Tarefa');

        this.tasklist = this.tasklist.filter(item => item.id !== id);
      }
    });
  }

  editTask(value: number) {
    this.router.navigate(['/Task'], {queryParams: { id: value }});
  }

  newTask() {
    this.router.navigate(['/Task']);
  }

  setStatus(value: Task): Task {

    switch (value.status) {
      case TaskStatus.NOVO:
        value.status = TaskStatus.FINALIZADO;
        value.isChecked = true;
        break;
      case TaskStatus.FINALIZADO:
        value.status = TaskStatus.NOVO;
        value.isChecked = false;
        break;
      default: value.status = TaskStatus.NOVO; break;
    }

    this.service.getColor(value);

    this.service.updateTask(value.id, value)
      .then(reuslt => {
        this.toastr.success('Tarefa alterada', 'Tarefa');
      })
      .catch(err => {
        this.toastr.warning('Problema ao atualizar a tarefa', 'Tarefa');
        console.log(err);
      });

    return value;
  }

  onTableDataChange(event){
    this.page = event;
    this.findAll();
  }

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1 ;
    this.findAll();
  }
}
