import {Component, OnInit, Pipe} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TaskStatus} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  providers: [DatePipe]
})
export class TaskComponent implements OnInit {

  task = new Task();
  formTask: FormGroup;
  taskTypes = TaskStatus;
  taskTypeOptions = [];
  id: number;

  constructor(private formBuilder: FormBuilder,
              private service: TaskService,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.id = +params.id;
        if (this.id !== undefined && !isNaN(this.id)) {
          this.service.showTasksId(this.id)
            .then(async value => {
              this.task = value;

              switch (this.task.status) {
                case TaskStatus.NOVO: this.task.status = TaskStatus.NOVO; break;
                case TaskStatus.FINALIZADO: this.task.status = TaskStatus.FINALIZADO; break;
                default: this.task.status = TaskStatus.NOVO; break;
              }

              this.createForm(this.task);
              this.taskTypeOptions = Object.keys(this.taskTypes);
            }).catch(err => console.log(err));
        }
      });

    this.createForm(this.task);
    this.taskTypeOptions = Object.keys(this.taskTypes);
  }

  createForm(task: Task) {
    this.formTask = this.formBuilder.group({
      titulo: [task.titulo, Validators.required],
      descricao: [task.descricao],
      status: [task.status, Validators.required],
      dataCriacao: [task.dataCriacao],
      dataConclusao: [task.dataConclusao]
    });
  }

  get f() {
    return this.formTask.controls;
  }

  onSubmit() {
    if (this.formTask.invalid) {
      return;
    }

    if (this.id !== undefined && !isNaN(this.id)) {
      this.service.updateTask(this.id, Object.assign(new Task(), this.formTask.value))
        .then(value => console.log(value))
        .catch(err => console.log(err));

      this.toastr.success('Tarefa alterada', 'Tarefa');
    } else {

      this.service.createTask(Object.assign(new Task(), this.formTask.value))
        .then(value => console.log(value))
        .catch(err => console.log(err));

      this.toastr.success('Tarefa inserida', 'Tarefa');

      this.formTask.reset();
    }
  }

  onCancel() {
    this.formTask.reset();
  }

}
