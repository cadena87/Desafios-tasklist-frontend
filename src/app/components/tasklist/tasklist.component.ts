import {Component, OnInit} from '@angular/core';
import {Task, TaskStatus} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
  providers: [DatePipe]
})
export class TasklistComponent implements OnInit {

  tasklist: Task[];
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [10, 25, 50, 100];

  constructor(private service: TaskService,
              private router: Router,
              private toastr: ToastrService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.findAll();
  }

  findAll() {
    this.service.showTasks()
      .then(value => {
        this.tasklist = value;

        this.tasklist.forEach(task => {
            task = this.getColor(task);
            this.isChecked(task);
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

  getColor(value: Task): Task {
    switch (value.status.toString()) {
      case 'NOVO': value.color = 'red'; break;
      case 'FINALIZADO': value.color = 'blue'; break;
      default: value.color = 'red'; break;
    }

    return value;
  }

  setStatus(value: Task): Task {
    switch (value.status) {
      case 'NOVO':
        value.status = TaskStatus.FINALIZADO;
        value.dataConclusao = new Date();

        this.service.updateTask(value.id, value)
          .then(task => {
            this.toastr.success('Tarefa finalizada', 'Tarefa');
          })
          .catch(err => console.log(err));
        break;
      case 'FINALIZADO': value.status = TaskStatus.NOVO; break;
      default: value.status = TaskStatus.NOVO; break;
    }

    this.getColor(value);

    return value;
  }

  isChecked(value: Task): boolean {
    value.isChecked = value.status === 'FINALIZADO';

    return value.isChecked;
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
