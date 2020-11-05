import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  taskStatus = TaskStatus;
  formTask: FormGroup;
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

              console.log(this.task);

              this.createForm(this.task);
            }).catch(err => console.log(err));
        }
      });

    this.createForm(this.task);
  }

  createForm(task: Task) {
    this.formTask = this.formBuilder.group({
      titulo: [task.titulo, Validators.required],
      descricao: [task.descricao],
      status: [task.status, Validators.required],
      dataCriacao: [this.datePipe.transform(task.dataCriacao, 'dd-MM-yyyy HH:mm:ss') || ''],
      dataConclusao: [this.datePipe.transform(task.dataConclusao, 'dd-MM-yyyy HH:mm:ss') || '']
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
        .then(value => {
          this.toastr.success('Tarefa alterada', 'Tarefa');
        })
        .catch(err => {
          this.toastr.warning('Problema ao atualizar a tarefa', 'Tarefa');
          console.log(err);
        });
    } else {

      this.service.createTask(Object.assign(new Task(), this.formTask.value))
        .then(value => {
          this.toastr.success('Tarefa inserida', 'Tarefa');
          console.log(value);
        })
        .catch(err => {
          this.toastr.warning('Problema ao gravar a tarefa', 'Tarefa');
          console.log(err);
        });

      this.formTask.reset();
    }
  }

  onCancel() {
    this.formTask.reset();
  }
}
